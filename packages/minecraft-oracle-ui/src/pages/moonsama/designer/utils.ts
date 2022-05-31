

export const reverseMap = (map: {[key:string]: string}) => {
    const reverseMap: {[key:string]: string} = {}

    Object.keys(map).map(key => {
        const val = map[key]

        reverseMap[val] = key
    })

    return reverseMap
}