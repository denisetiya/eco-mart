import express, { Request, Response } from "express";
import ProductService from "./product.service";
import Res from "../../utils/response.api";
import multer from 'multer';
import dotenv from "dotenv";

import serverKey from "../../middleware/server.key";
import { v2 as cloudinary } from 'cloudinary';
import sharp from "sharp";
import streamifier from 'streamifier';
import { iAddProduct, iProductVariant, iUpdateProduct } from "../../types/product";
dotenv.config();

const product: express.Router = express();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string,
});

const upload = multer({ storage: multer.memoryStorage() });

// Fetch all products
product.get("/products", serverKey, async (req: Request, res: Response) => {
  try {
    const products = await ProductService.getProducts(req.query as any);

    return Res(res, 200, "Success", null, products || []);

  } catch (error: any) {
    console.error("Error fetching products:", error);
    return Res(res, error.status,'failed get products', error.message );
  }
});

// Fetch product by ID
product.get("/products/:id", serverKey, async (req: Request, res: Response) => {
  try {
    const product = await ProductService.getProducts({id : req.params.id as string});
    if (!product) {
      return Res(res, 404, "Not Found", "Product not found");
    }
    return Res(res, 200, "Success", null, product);
  } catch (error: any) {
    console.error("Error fetching product by ID:", error);
    return Res(res, error.status,'failed get product id', error.message );
  }
});

// Create a new product
product.post('/product', upload.single('image'), async (req: Request, res: Response) => {
  if (!req.file) {
    return Res(res, 400, "Bad Request", "File not found");
  }

  try {
    // Compress image
    const compressedImage = await sharp(req.file.buffer).jpeg({ quality: 80 }).toBuffer();

    // Upload image to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream({
        folder: "products",
        format: "jpeg",
        resource_type: "image"
      }, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });

      streamifier.createReadStream(compressedImage).pipe(uploadStream);
    });

    const image = (uploadResult as any).secure_url;
    const {sallerId, productName, productDesc, productStock, productPrice, productCategory}: iAddProduct = req.body;

    const productData: iAddProduct = {
      sallerId,
      productPrice: parseInt(productPrice?.toString() || "0"),
      productStock: parseInt(productStock?.toString() || "0"),
      productCategory,
      productDesc,
      productName,
      imgUrl: image
    };

    const product = await ProductService.addProduct(productData);

    return Res(res, 200, "Success", null, product, {
        route : "/product/variant/:id",
        method : "POST" 
    });

  } catch (error: any) {
    console.error("Error creating product:", error);
    return Res(res, error.status,'failed add new product', error.message , null);
  }
});

// Delete a product
product.delete("/product/:id",  async (req: Request, res: Response) => {
  try {
    const product = await ProductService.deleteProduct(req.params.id as string);
    if (!product) {
      return Res(res, 404, "Not Found", "Product not found");
    }
    return Res(res, 200, "Success", null, product);
  } catch (error: any) {
    console.error("Error deleting product:", error);
    return Res(res, error.status,'failed delete product', error.message );
  }
});

// Edit a product
product.put("/product/:id", upload.single('image'), async (req: Request, res: Response) => {
  try {
    const { productName, productDesc, productStock, productPrice, productCategory}: iUpdateProduct = req.body;

    let image;
    if (req.file) {
      // Compress and upload new image if provided
      const compressedImage = await sharp(req.file.buffer).jpeg({ quality: 80 }).toBuffer();
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream({
          folder: "products",
          format: "jpeg",
          resource_type: "image"
        }, (error, result) => {
          if (error) return reject(error);
          resolve(result);
        });

        streamifier.createReadStream(compressedImage).pipe(uploadStream);
      });

      image = (uploadResult as any).secure_url;
    }

    const productData: Partial<iUpdateProduct> = {
        productPrice: parseInt(productPrice?.toString() || "0"),
        productStock: parseInt(productStock?.toString() || "0"),
        productCategory,
        productDesc,
        productName,
        imgUrl: image
    };

    const product = await ProductService.updateProduct(req.params.id as string, productData);
    if (!product) {
      return Res(res, 404, "Not Found", "Product not found");
    }
    return Res(res, 200, "Success", null, product);
  } catch (error: any) {
    console.error("Error editing product:", error);
    return Res(res, error.status,'failde edit product', error.message );
  }
});


product.post('/product/variant/:id',upload.single('image'), async (req: Request, res: Response) => {
  
  const { id }  = req.params;
  const { variantName, stock} : iProductVariant = req.body;

  try {

        // Compress image
        const compressedImage = await sharp(req.file?.buffer).jpeg({ quality: 80 }).toBuffer();

        // Upload image to Cloudinary
        const uploadResult = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream({
            folder: "products",
            format: "jpeg",
            resource_type: "image"
          }, (error, result) => {
            if (error) return reject(error);
            resolve(result);
          });
    
          streamifier.createReadStream(compressedImage).pipe(uploadStream);
        });
    
        const image = (uploadResult as any).secure_url;

        const variant = await ProductService.addVariant(
            {
                productId : id as string,
                variantName : variantName,
                stock : stock,
                variantImg : image
            }
        );

        if (!variant) {
        return Res(res, 400, "Bad Request", "Failed to add variant");
        }
    
    return Res(res, 200, "Success", null, variant);
  } catch (error: any) {
    console.error("Error adding variant:", error);
    return Res(res, error.status,'failed add new variant', error.message );
  }

})

export default product;
