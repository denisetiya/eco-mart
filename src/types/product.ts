export interface iGetProduct {
    id? : string,
    sallerId? : string,
    search? : string,
    category? : string,
    sold? : string,
    priceMin? : number,
    priceMax? : number,
}

export interface iAddProduct {
    sallerId : string,
    imgUrl? : string,
    productName : string,
    productDesc : string,
    productStock : number,
    productPrice : number,
    productCategory : string,
}

export interface iProductVariant {
    productId : string,
    variantName : string,
    stock : number,
    variantImg : string
}


export interface iUpdateProduct {
    imgUrl? : string,
    productName? : string,
    productDesc? : string,
    productStock? : number,
    productPrice? : number,
    productCategory? : string,
}
