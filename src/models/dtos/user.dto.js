export class SaveUserDTO{
    constructor(payload){
        this.first_name = payload.user.first_name
        this.last_name = payload.user.last_name
        this.email = payload.user.email
        this.role = payload.user.role
        this.cart = payload.user.cart
    }
}