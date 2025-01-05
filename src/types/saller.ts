

export interface iSallerAddress {
    sallerId : string
    provinsi : string
    kota : string
    kecamatan : string
    kelurahan : string
    detail : string
}


export interface iAddSaller {
    userId : string
    sallerName : string
    sallerDesc : string
    sallerImg : string
    sallerApproved : boolean
}

export interface iUpdateSaller {
    userId : string
    sallerName? : string
    sallerDesc? : string
    sallerImg? : string
    sallerApproved? : boolean
}