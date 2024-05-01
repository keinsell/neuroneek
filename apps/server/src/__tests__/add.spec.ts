import {expect, test} from '@jest/globals'
import {add}          from "../add.js"



test("add 1+1=2", () =>{
	expect(add(1, 2)).toBe(3)
})

test("add -10+1=9", () =>{
	expect(add(-10, 1)).toBe(-9)
})