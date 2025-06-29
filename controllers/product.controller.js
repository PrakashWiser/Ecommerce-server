import Product from "../models/product.model.js";
import cloudinary from "cloudinary";

export const createProduct = async (req, res) => {
  try {
    const { name, price, description, image, listingType } = req.body;
    if (!name || !price || !description || !image || !listingType) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const uploadResponse = await cloudinary.uploader.upload(image);
    const imageUrl = uploadResponse.secure_url;

    const product = new Product({
      name,
      price,
      description,
      image: imageUrl,
      listingType,
    });

    const saved = await product.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error("❌ Product creation error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const query = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: "i",
          },
        }
      : {};

    const products = await Product.find(query);
    res.json(products);
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

    let imageUrl = product.image;

    if (image && image.startsWith("data:image")) {
      try {
        const parts = product.image.split("/");
        const filename = parts[parts.length - 1];
        const publicId = filename.split(".")[0];

        await cloudinary.uploader.destroy(publicId);
        const uploaded = await cloudinary.uploader.upload(image);
        imageUrl = uploaded.secure_url;
      } catch (error) {
        console.error("❌ Cloudinary image update error:", error);
        return res.status(400).json({ error: "Failed to upload new image" });
      }
    }

    product.name = name ?? product.name;
    product.price = price ?? product.price;
    product.description = description ?? product.description;
    product.image = imageUrl;
    product.listingType = listingType ?? product.listingType;

    const updated = await product.save();
    res.json(updated);
  } catch (error) {
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
