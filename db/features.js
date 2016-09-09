var featuresDb = new TAFFY ([//PRICE to researach, Points which it will require when used in engines
    {id: 1, name: "Text Based Graphics", price: 10, time:10, points: 5, type:"code", domain:"Graphics", pointReq: 5, featReq: [0], techLevel: 1},
    
    {id: 2, name: "Basic 2D Graphics", price: 100, time:20, points: 10, type:"code", domain:"Graphics", pointReq: 5, featReq: [1], techLevel: 2},
    {id: 3, name: "Medium 2D Graphics", price: 200, time:30, points: 25, type:"code", domain:"Graphics", pointReq: 15, featReq: [2], techLevel: 2},
    {id: 4, name: "Advanced 2D Graphics", price: 400, time:40, points: 50, type:"code", domain:"Graphics", pointReq: 25, featReq: [3], techLevel: 2},
    
    {id: 5, name: "Basic 2D Physics", price: 200, time:20, points: 15, type:"code", domain:"Code", pointReq: 15, featReq: [2], techLevel: 2},
    {id: 6, name: "Medium 2D Physics", price: 200, time:30, points: 25, type:"code", domain:"Code", pointReq: 15, featReq: [5], techLevel: 2},
    {id: 7, name: "Advanced 2D Physics", price: 200, time:40, points: 55, type:"code", domain:"Code", pointReq: 15, featReq: [6], techLevel: 2},
    
    {id: 8, name: "Basic 2D Art", price: 100, time:20, points: 10, type:"art", domain:"Art", pointReq: 5, featReq: [4], techLevel: 2},
    {id: 9, name: "Medium 2D Art", price: 300, time:30, points: 20, type:"art", domain:"Art", pointReq: 15, featReq: [3, 5], techLevel: 2},
    {id: 10, name: "Advanced 2D Art", price: 500, time:40, points: 40, type:"art", domain:"Art", pointReq: 25, featReq: [6, 4], techLevel: 2},
    
    {id: 11, name: "Basic 3D Graphics", price: 200, time:20, points: 25, type:"code", domain:"Graphics", pointReq: 15, featReq: [7, 10], techLevel: 3},
    {id: 12, name: "Medium 3D Graphics", price: 200, time:30, points: 45, type:"code", domain:"Graphics", pointReq: 15, featReq: [11], techLevel: 3},
    {id: 13, name: "Advanced 3D Graphics", price: 200, time:40, points: 65, type:"code", domain:"Graphics", pointReq: 15, featReq: [12], techLevel: 3},
    
    {id: 14, name: "Basic 8-bit Sounds", price: 20, time:20, points: 5, type:"audio", domain:"Audio", pointReq: 5, featReq: [1], techLevel: 1},
    {id: 15, name: "Medium 8-bit Sounds", price: 20, time:30, points: 15, type:"audio", domain:"Audio", pointReq: 5, featReq: [14], techLevel: 2},
    {id: 16, name: "Advanced 8-bit Sounds", price: 20, time:40, points: 25, type:"audio", domain:"Audio", pointReq: 5, featReq: [15], techLevel: 2},
]);