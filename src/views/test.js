
function f1(fn){
  var a=200;
  fn();
}

var a=100;

f1(function(){
  console.log(a);
});

var i;
for(i=0;i<10;i++){
  (function (i) {
    console.log(i);
  })(i);
}
