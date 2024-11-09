import {test, expect} from "vitest"
import { MIN_PASSWORD_LENGTH } from "../../../shared/const";
import { loginInputValidation } from "../components/Login"

test("Test login invalid input", ()=>{
    let user = "Frank";
    let password = "12345678";
    expect(loginInputValidation("", password)).toStrictEqual({type:"user", message: "Skriv inn brukerinformasjon", valid: false})
    expect(loginInputValidation(user, "123")).toStrictEqual({type:"password", message: `Passordet må minst være ${MIN_PASSWORD_LENGTH} tegn`, valid: false})
    expect(loginInputValidation(user, "")).toStrictEqual({type:"password", message: "Skriv inn passord", valid: false})
})

test("Test login valid input", ()=>{
    expect(loginInputValidation("Frank", "12345678")).toStrictEqual({type:"", valid: true})
})