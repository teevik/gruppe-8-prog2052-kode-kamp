import {test, expect} from "vitest";
import { registerInputValidation } from "../components/Register";
import {MIN_PASSWORD_LENGTH} from "../../../shared/const"

let username = "John Doe";
let password = "12345678";
let email = "abc@gmail.com";

test("Test register invalid input", ()=>{

    //Email tests
    expect(registerInputValidation(username, "", password, password)).toEqual(["email", "Please enter your email", false]);
    expect(registerInputValidation(username, "gmail.com", password, password)).toEqual(["email", "Please enter a valid email address", false]);
    expect(registerInputValidation(username, "abc@gmailcom", password, password)).toEqual(["email", "Please enter a valid email address", false]);
    expect(registerInputValidation(username, "abcgmailcom", password, password)).toEqual(["email", "Please enter a valid email address", false]);

    //Username test
    expect(registerInputValidation("", email, password, password)).toEqual(["username", "Please enter a username", false]);

    //Password tests
    expect(registerInputValidation(username, email, "123", "123")).toEqual(["password", `Password must be ${MIN_PASSWORD_LENGTH} characters or longer`, false,]);
    expect(registerInputValidation(username, email, "1234567", "1234567")).toEqual(["password", `Password must be ${MIN_PASSWORD_LENGTH} characters or longer`, false,]);
    expect(registerInputValidation(username, email, "12345678", "87654321")).toEqual(["password", "Passwords do not match", false]);


})

test("Test register valid input", ()=>{
    let success = ["success", "", true];
    expect(registerInputValidation(username, email, password, password)).toEqual(success);
})