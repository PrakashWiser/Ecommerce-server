import Product from "../models/product.model.js";
import cloudinary from "cloudinary";
import Queue from "bull";

const imageQueue = new Queue("image-upload", {
  redis: { host: "127.0.0.1", port: 6379 },
});

export const createProduct = async (req, res) => {
  try {
    const { name, price, description, image, listingType } = req.body;
    if (!name || !price || !description || !image || !listingType) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const product = new Product({ name, price, description, listingType });
    const saved = await product.save();

    await imageQueue.add({ productId: saved._id, image });
    res.status(201).json(saved);
  } catch (error) {
    console.error("❌ Product creation error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const { keyword, listingType } = req.query;
    const query = {};
    if (keyword) query.name = { $regex: keyword, $options: "i" };
    if (listingType) query.listingType = listingType;

    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");
    const products = await Product.find(query);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCategoryCounts = async (req, res) => {
  try {
    const counts = await Product.aggregate([
      { $group: { _id: "$listingType", count: { $sum: 1 } } },
      { $project: { listingType: "$_id", count: 1, _id: 0 } },
    ]);
    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");
    res.json(counts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { name, price, description, image, listingType } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.name = name ?? product.name;
    product.price = price ?? product.price;
    product.description = description ?? product.description;
    product.listingType = listingType ?? product.listingType;

    if (image && image.startsWith("data:image")) {
      await imageQueue.add({
        productId: product._id,
        image,
        oldImage: product.image,
      });
    }

    const updated = await product.save();
    res.json(updated);
  } catch (error) {
    console.error("❌ Product update error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

imageQueue.process(async (job) => {
  const { productId, image, oldImage } = job.data;
  try {
    if (oldImage) {
      const parts = oldImage.split("/");
      const filename = parts[parts.length - 1];
      const publicId = filename.split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }
    const uploadResponse = await cloudinary.uploader.upload(image);
    await Product.findByIdAndUpdate(productId, {
      image: uploadResponse.secure_url,
    });
  } catch (error) {
    console.error("❌ Image upload queue error:", error);
  }
});
