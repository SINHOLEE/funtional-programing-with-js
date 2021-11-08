const {groupLog, lg} = require("../utils");
// if else || && 삼항연산자
// 괄호안에서는 비동기 통신을 할 수 없다.
groupLog('에러가 나는 문법들')(()=>{
    // 컴파일이 불가능한 코드
    // if(var a= 0){
    //     lg(a)
    // }

    // 실행은 가능하지만 f1을 쓸 수 없는 코드
    if(function f1(){}){
        lg('hi')
    }
    f1()
})

groupLog('괄호 안에서 실행 가능한 코드들')(()=>{

})