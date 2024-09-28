import {test, expect} from 'vitest'
import {getTimer} from '../../components/CountDown'

test('Test countdown converter', ()=>{
    expect(getTimer(72)).toBe("1m 12s")
    expect(getTimer(60)).toBe("1m 0s")
    expect(getTimer(50)).toBe("50s")
    expect(getTimer(0)).toBe("0s")
})