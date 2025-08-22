import type IProducts from "./products";


export default interface ICart {
    id_cart : number;
    id_user : number;
    products: IProducts[];
}