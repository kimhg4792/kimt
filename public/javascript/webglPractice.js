function type_test(test) {

  for(var i=0; i<test.xaxis.length; i++) {
    console.log("------------------------------------");
    console.log(test.xaxis[i].toString() + " : " + typeof test.xaxis[i]);
    console.log(test.yaxis[i].toString() + " : " + typeof test.yaxis[i]);
    console.log(test.zaxis[i].toString() + " : " + typeof test.zaxis[i]);
    console.log(test.size[i].toString() + " : " + typeof test.size[i]);
    console.log(test.red[i].toString() + " : " + typeof test.red[i]);
    console.log(test.green[i].toString() + " : " + typeof test.green[i]);
    console.log(test.blue[i].toString() + " : " + typeof test.blue[i]);
    console.log(test.alpha[i].toString() + " : " + typeof test.alpha[i]);
    console.log(test.width[i].toString() + " : " + typeof test.width[i]);
    console.log(test.opacity[i].toString() + " : " + typeof test.opacity[i]);
    console.log(test.type[i].toString() + " : " + typeof test.type[i]);
    console.log("------------------------------------");
  }
  
  }

function makeArr(text, type) {
  var arr = [];
  var temp = '';

  for(var i=0; i<text.length; i++) {

    if(type === "num") {
      if(text.charAt(i) === ',') {
        arr.push(parseFloat(temp));
        temp='';
      } else {
        temp += text.charAt(i);
        if(i === text.length -1) arr.push(parseFloat(temp));
      }
    } else if(type === "str") {
      if(text.charAt(i) === ',') {
        arr.push(temp);
        temp='';
      } else {
        temp += text.charAt(i);
        if(i === text.length -1) arr.push(temp);
      }
    } else {
    }

  }


  return arr;
}

function define_variable() {
    var xaxis = makeArr(document.getElementById("xaxis").innerText.toString(), "num");
    var yaxis = makeArr(document.getElementById("yaxis").innerText.toString(), "num");
    var zaxis = makeArr(document.getElementById("zaxis").innerText.toString(), "num");
    var size = makeArr(document.getElementById("size").innerText.toString(), "num");
    var r = makeArr(document.getElementById("r").innerText.toString(), "num");
    var g = makeArr(document.getElementById("g").innerText.toString(), "num");
    var b = makeArr(document.getElementById("b").innerText.toString(), "num");
    var a = makeArr(document.getElementById("a").innerText.toString(), "num");
    var width = makeArr(document.getElementById("width").innerText.toString(), "num");
    var opac = makeArr(document.getElementById("opacity").innerText.toString(), "num");
    var type = makeArr(document.getElementById("type").innerText.toString(), "str");

    var array = {
      xaxis: xaxis,
      yaxis: yaxis,
      zaxis: zaxis,
      size: size,
      red: r,
      green: g,
      blue: b,
      alpha: a,
      width: width,
      opacity: opac,
      type: type
    };

    return array;

}

function makeTrace(data) {
  var tempArr = [];

    for(var i=0; i< data.xaxis.length; i++) {
      var temp = {
        x : [data.xaxis[i]],
        y: [data.yaxis[i]],
        z : [data.zaxis[i]],
        mode: 'markers',
        marker: {
            size: data.size[i],
            line: {
            color: `rgba(${data.red[i]}, ${data.green[i]}, ${data.blue[i]}, ${data.alpha[i]})`,
            width: data.width[i]
            },
            opacity: data.opacity[i]
        },
        type: data.type[i]
      };
     



      tempArr.push(temp);
    }
    
    return tempArr;
}

var layout = {
  margin: {
      l: 1,
      r: 1,
      b: 1,
      t: 1
  },
  xaxis : {
      title : "This",
  },
  yaxis : {
      title : "That"
  },
  zaxis : {
      title : "where"
  }
};  

async function graphic_run() {

  var data = define_variable();
  var traceData = makeTrace(data);
  try {
    console.log(traceData);

  } catch (err) {
    console.log('--------------error------------------');
  } 
  
  Plotly.newPlot('myDiv', traceData, layout);
  
}