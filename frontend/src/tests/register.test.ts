import {test, expect} from "vitest";
import { registerInputValidation } from "../components/Register";
import {MIN_PASSWORD_LENGTH} from "../../../shared/const"

let username = "John Doe";
let password = "12345678";
let email = "abc@gmail.com";

test("Test register invalid input", ()=>{

    //Email tests
    expect(registerInputValidation(username, "", password, password)).toEqual(["email", "Skriv inn e-postadresse", false]);
    expect(registerInputValidation(username, "wefiw/@gmail.com", password, password)).toEqual(["email", "Skriv inn en gyldig e-postadresse", false]);
    expect(registerInputValidation(username, "gmail.com", password, password)).toEqual(["email", "Skriv inn en gyldig e-postadresse", false]);
    expect(registerInputValidation(username, "abc@gmailcom", password, password)).toEqual(["email", "Skriv inn en gyldig e-postadresse", false]);
    expect(registerInputValidation(username, "abcgmailcom", password, password)).toEqual(["email", "Skriv inn en gyldig e-postadresse", false]);

    //Username test
    expect(registerInputValidation("", email, password, password)).toEqual(["username", "Skriv inn brukernavn", false]);

    //Password tests
    expect(registerInputValidation(username, email, "123", "123")).toEqual(["password", `Passordet må være minst ${MIN_PASSWORD_LENGTH} tegn`, false,]);
    expect(registerInputValidation(username, email, "1234567", "1234567")).toEqual(["password", `Passordet må være minst ${MIN_PASSWORD_LENGTH} tegn`, false,]);
    expect(registerInputValidation(username, email, "12345678", "87654321")).toEqual(["password", "Passord er ikke likt", false]);


})

test("Test register valid input", ()=>{
    let success = ["success", "", true];
    expect(registerInputValidation(username, email, password, password)).toEqual(success);
})