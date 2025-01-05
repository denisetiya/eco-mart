import { Router } from "express"
import prisma from "../../config/prisma.config";
import handleError from "../../utils/handleError";
import { iAddProduct, iGetProduct, iProductVariant, iUpdateProduct } from "../../types/product";

const product: Router = Router();


export default class ProductService {
    static async getProducts(paramData:iGetProduct) {
        try {
            let products : any = null

            if (!paramData) {
                products = await prisma.product.findMany();
                return products;
            } else if (paramData.id) {
                products = await prisma.product.findUnique({
                    where: {
                        id: paramData.id
                    }
                })
            }else if (paramData.sallerId) {
                products = await prisma.product.findMany({
                    where: {
                        sallerId: paramData.sallerId
                    }
                })
            }else if (paramData.search) {
                products = await prisma.product.findMany({
                    where: {
                        productName: {
                            contains: paramData.search
                        }
                    }
                })
            }else if (paramData.category) {
                products = await prisma.product.findMany({
                    where: {
                        productCategory: paramData.category
                    }
                })
            }else if (paramData.sold == "desc") {
                products = await prisma.product.findMany({
                    orderBy : {
                        productSold : "desc"   
                    }
                })
            } else if (paramData.sold == "asc") {
                products = await prisma.product.findMany({
                    orderBy : {
                        productSold : "asc"   
                    }
                })
            }else if (paramData.priceMin) {
                products = await prisma.product.findMany({
                    where : {
                        productPrice : {
                            gte : paramData.priceMin
                        }
                    }
                })
            }else if (paramData.priceMin && paramData.priceMax) {
                products = await prisma.product.findMany({
                    where : {
                        productPrice : {
                            gte : paramData.priceMin,
                            lte : paramData.priceMax
                        }
                    }
                })
            } 
            return products

        }   catch (error : unknown) {
            handleError(error)
        }   
    }

    static async addProduct(productData : iAddProduct) {
        try {
            const newProducts = await prisma.product.create({
                data: {
                    sallerId : productData.sallerId,
                    imgUrl: productData.imgUrl ?? "https://res.cloudinary.com/dst7qcigz/image/upload/v1732372933/user/mvntmplanmz49w32hqq7.jpg",
                    productName : productData.productName,
                    productDesc : productData.productDesc,
                    productStock : productData.productStock,
                    productPrice : productData.productPrice,
                    productCategory : productData.productCategory
                }
            })
            return newProducts
        } catch (error : unknown) {
            handleError(error)
        }
    }

    static async addVariant(productData : iProductVariant) {
        try {
            const newVariant = await prisma.productVariant.create({
                data: {
                    productId : productData.productId,
                    variantName : productData.variantName,
                    stock : productData.stock,
                    variantImg : productData.variantImg
                }
            })
            return newVariant
        } catch (error : unknown) {
            handleError(error)
        }
    }

    static async updateProduct(productId :string, productData:iUpdateProduct){
        try {
            const editedData = await prisma.product.update({
                where: { id : productId},
                data : productData
            })

            return editedData
        } catch (error) {
            handleError(error)
        }
    }

    static async deleteProduct(productId : string) {
        try {
            const deleteProduct = await prisma.product.delete({
                where: {
                    id : productId
                }
            })

            return deleteProduct
        } catch (error : unknown) {
            handleError(error)
        }
    }

}