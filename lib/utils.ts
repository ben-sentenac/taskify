import { access } from "fs/promises";

//TODO add better type 
export function deepEqual<T>(obj1:T,obj2:T) {
    //track circular ref
    const seenObj = new Map<object, object>();
    function compare(a:unknown,b:unknown) {
        //same reference
        if(a === b) return true;

        if(typeof a !== 'object' || a === null || typeof b !== 'object' || b === null) {
            return false;
        }

        if(seenObj.has(a) && seenObj.has(b)) {
            return seenObj.get(a) === b;
        }

        seenObj.set(a,b);

        //get keys of both objects
        const keysA = Object.keys(a);
        const keysB = Object.keys(b);

        if(keysA.length !== keysB.length) return false;

        for(let key of keysA) {
            //TODO feat : replace hasOwnPorperty.call by hasOwn()
            if(!Object.prototype.hasOwnProperty.call(b,key)) {
                return false;
            }

            if(!compare((a as Record<string,unknown>)[key],(b as Record<string,unknown>)[key])) {
                return false;
            }
        }
        return true;
    }
    return compare(obj1,obj2);
}


export async function fileExists(file:string) {
    try {
        await access(file);
        return true;
    } catch (error) {
        return false;
    }
}
