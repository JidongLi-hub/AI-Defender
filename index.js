var final_score = 0;
var final_level = "bad";
function ratio(score = 0.0) //score是0-1之间的两位小数
{        
    var dom = document.getElementById('ratio-container');
    var myChart = echarts.init(dom, null, {
      renderer: 'canvas',
      useDirtyRect: false
    });
    var app = {};
    
    var option;

    option = {
  series: [
    {
      type: 'gauge',
      startAngle: 180,
      endAngle: 0,
      center: ['50%', '75%'],
      radius: '90%',
      min: 0,
      max: 1,
      splitNumber: 8,
      axisLine: {
        lineStyle: {
          width: 6,
          color: [
            [0.25, '#FF6E76'],
            [0.5, '#FDDD60'],
            [0.75, '#58D9F9'],
            [1, '#07e162']
          ]
        }
      },
      pointer: {
        icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
        length: '12%',
        width: 20,
        offsetCenter: [0, '-60%'],
        itemStyle: {
          color: 'auto'
        }
      },
      axisTick: {
        length: 12,
        lineStyle: {
          color: 'auto',
          width: 2
        }
      },
      splitLine: {
        length: 20,
        lineStyle: {
          color: 'auto',
          width: 5
        }
      },
      axisLabel: {
        color: '#464646',
        fontSize: 20,
        distance: -60,
        rotate: 'tangential',
        formatter: function (value) {
          if (value === 0.875) {
            return '优';
          } else if (value === 0.625) {
            return '良';
          } else if (value === 0.375) {
            return '中';
          } else if (value === 0.125) {
            return '差';
          }
          return '';
        }
      },
      title: {
        offsetCenter: [0, '-10%'],
        fontSize: 20
      },
      detail: {
        fontSize: 30,
        offsetCenter: [0, '-35%'],
        valueAnimation: true,
        formatter: function (value) {
          return Math.round(value * 100) + '';
        },
        color: 'inherit'
      },
      data: [
        {
          value: score,
          name: '安全性总评'
        }
      ]
    }
  ]
};

    if (option && typeof option === 'object') {
      myChart.setOption(option);
    }

    window.addEventListener('resize', myChart.resize);
}
  
function silder(score, score_value){
  const scoreInput = document.getElementById(score);
  const scoreValueDisplay = document.getElementById(score_value);

  // 监听滑块值的变化
  scoreInput.addEventListener('input', function() {
    // 获取滑块的值
    const score = scoreInput.value;
    // 更新显示选择的值
    scoreValueDisplay.textContent = score;
  });
}
function openFileManager() {
  // 触发文件选择框的点击事件
  var fileInput = document.getElementById('file-input');
  // 添加change事件监听器
  fileInput.addEventListener('change', function(event) {
    // 获取用户选择的文件
    var selectedFile = event.target.files[0];
    var file = selectedFile.name.split('.').slice(0, -1).join('.');
    var f = document.getElementById("model");
    f.innerHTML = file
    // 处理用户选择的文件
    console.log('用户选择的文件:', selectedFile);
    
    // 这里你可以进一步处理用户选择的文件，比如读取文件内容等操作
    model_file = selectedFile;
});

// 触发文件选择框的点击事件
fileInput.click();
}

function start_detect(){
  var data = {
    "model" : document.getElementById("model").innerText,  //目前只上传模型名，后端去特定路径下寻找模型。之后需要用户上传模型文件，后端接收并评测
    "device" : document.getElementById("device").value,
    "batch_size" :document.getElementById("batch_size_value").innerText, 
    "backdoor_method":document.getElementById("bd_method").value,
    "poison_epoch":document.getElementById("epoch_value").innerText, 
    "poison_batch_size":document.getElementById("bsize").value,
    "poison_method":document.getElementById("pmethod").value,
    "dataset":document.getElementById("dataset").value
  }
  show_load(1, true);
  show_load(2, true);
  show_load(3, true);

fetch('/detect', {
  method: 'POST',
  headers: {
      'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
})
.then(response => response.json())
.then(handleResponse)
.catch(error => {
  console.error('发生错误:', error);
});
}

function handleResponse(data) {
  console.log('收到来自服务器的响应:', data);
  show_load(1, false);
  show_load(2, false);
  show_load(3, false);
  // 这里可以对服务器的响应进行进一步处理，展示测评结果
  var scores = []
  for (var key in data) {
    if (key!='final_score') { 
      scores.push(data[key]);
    }
    else{
      final_score = data[key]/100;
      if (final_score>=0.875)
      {
        final_level = "excellent";
      }
      else if(final_score>=0.625 && final_score<0.875)
      {
        final_level = "good";
      }
      else if(final_score>=0.375 && final_score<0.625)
      {
        final_level = "middle";
      }
      else{
        final_level = "bad";
      }
      ratio(final_score);
    }
  }
  result(scores);
}

function handleError(error) {
  console.error('发生错误:', error);
  // 这里可以处理发生的错误
  alert("检测失败，请重新检测！")
}

function show_load(loadid,sign){
  if (loadid==1)
  {
    var p = document.getElementById('loading1');
  }
  else if (loadid==2)
  {
    var p = document.getElementById('loading2');
  }
  else if (loadid==3)
  {
    var p = document.getElementById('loading3');
  }
  if (sign==true){
    p.style.width = '100%';
    p.style.height = '100%';
    p.style.fontSize = '35px';
    p.style.display = 'flex';
    p.style.marginTop = '16vh';
    p.style.justifyContent = 'space-between';
  }
  else {
    p.style.display = 'none';
  } 
}


function result(scores){  //显示各项指标
  var values = document.getElementsByClassName("value");
  if (scores.length>0){
    for (var i=0; i<values.length; i++)
  {
    values[i].innerHTML = scores[i];
  }
  }
  else{
    for (var i=0; i<values.length; i++)
  {
    values[i].innerHTML = '—';
  }
  }
  
}
 





function report() {
  const table = document.getElementById("result_table");

  // 使用html2canvas将table元素转换为canvas
  html2canvas(table).then(canvas => {
    // 创建一个新的jsPDF实例
    const pdf = new jsPDF();

    // 添加标题到PDF
    const title = "深度学习模型"; // 标题文本
    pdf.setFontSize(16); // 设置字体大小
    pdf.text(title, 10, 20); // 在指定位置添加标题

    // 计算表格转换为图片后的尺寸
    const imgWidth = pdf.internal.pageSize.getWidth() - 20; // 图片宽度，留出边距
    const imgHeight = canvas.height * imgWidth / canvas.width; // 根据宽度等比例缩放高度

    // 将canvas转换为图片，并添加到PDF中
    const imgData = canvas.toDataURL('image/jpeg');
    pdf.addImage(imgData, 'JPEG', 10, 30, imgWidth, imgHeight);

    // 保存PDF文件
    pdf.save("report_with_table.pdf");
  });
}

function report() {
  const table = document.getElementById("result_table");
  const modelElement = document.getElementById("model");
  const modelText = modelElement.innerText;

  // 获取表格中的指标值
  const accValue = parseFloat(document.getElementById("CACC").innerText);
  const tccValue = parseFloat(document.getElementById("ASR").innerText);
  const dfgValue = parseFloat(document.getElementById("ACTC").innerText);
  // const totalValue = accValue + tccValue + dfgValue;
  const totalValue = 3;

  // 创建一个新的 canvas 元素用于渲染标题
  const titleCanvas = document.createElement('canvas');
  const titleCtx = titleCanvas.getContext('2d');
  const titleFontSize = 36; // 提高字体大小以提高清晰度
  const titleFontFamily = 'Arial'; // 标题字体
  const titleText = `${modelText}模型评估结果`; // 标题文本
  titleCtx.font = `${titleFontSize}px ${titleFontFamily}`;
  const titleWidth = titleCtx.measureText(titleText).width;

  // 获取设备像素比
  const dpi = 4;

  // 设置标题画布分辨率
  titleCanvas.width = (titleWidth + 20) * dpi; // 加上一些额外的宽度
  titleCanvas.height = (titleFontSize + 20) * dpi; // 加上一些额外的高度

  // 缩放标题画布
  titleCtx.scale(dpi, dpi);

  // 绘制白色背景
  titleCtx.fillStyle = 'white';
  titleCtx.fillRect(0, 0, titleCanvas.width, titleCanvas.height);

  // 绘制标题文本
  titleCtx.fillStyle = 'black';
  titleCtx.font = `${titleFontSize}px ${titleFontFamily}`;
  titleCtx.fillText(titleText, 10, titleFontSize + 10);

  // 创建一个新的 canvas 元素用于渲染模型质量文字
  const qualityCanvas = document.createElement('canvas');
  const qualityCtx = qualityCanvas.getContext('2d');
  const qualityFontSize = 18; // 字体大小
  const qualityFontFamily = 'Arial'; // 字体
  const G00d_qualityText = `模型很好`;
  const Bad_qualityText = `模型很差`;

  // 根据指标和判断模型质量
  if (totalValue >= 0 && totalValue <= 30) {
     qualityText = "模型很差";
  } else if (totalValue > 30 && totalValue <= 60) {
     qualityText = "模型尚可";
  } else if (totalValue > 60 && totalValue <= 100) {
     qualityText = "模型很好";
  } else {qualityText = "模型未评分"}

  qualityCanvas.width = (qualityCtx.measureText(qualityText).width+200) * dpi;
  qualityCanvas.height = (qualityFontSize+20) * dpi;

  // 绘制模型质量文本
  qualityCtx.scale(dpi, dpi);
  qualityCtx.fillStyle = 'black';
  qualityCtx.font = `${qualityFontSize}px ${qualityFontFamily}`;
  qualityCtx.fillText(qualityText, 0, qualityFontSize);

  // 创建一个新的 jsPDF 实例
  const pdf = new jsPDF('p', 'pt', 'a4');

  // 添加 logo 到 PDF 左上方
  const logo = new Image();
  logo.src = 'static/logo.png'; // 加载 logo 图片
  logo.onload = function() {
    const logoHeight = 70; // 设置 logo 高度
    pdf.addImage(logo, 'PNG', 10, 10, logoHeight * logo.width / logo.height, logoHeight);

    // 添加标题图片到 PDF
    const titleImgData = titleCanvas.toDataURL('image/png');
    pdf.addImage(titleImgData, 'PNG', 80, 8, titleCanvas.width / dpi, titleCanvas.height / dpi);

    // 使用 html2canvas 将 table 元素转换为 canvas
    html2canvas(table, { dpi: 5 }).then(tableCanvas => {
      // 计算表格转换为图片后的尺寸
      const tableWidth = pdf.internal.pageSize.getWidth() - 20; // 表格宽度，留出边距
      const tableHeight = tableCanvas.height * tableWidth / tableCanvas.width; // 根据宽度等比例缩放高度

      // 将表格 canvas 转换为图片，并添加到 PDF 中
      const tableImgData = tableCanvas.toDataURL('image/png');
      pdf.addImage(tableImgData, 'PNG', 10, 80, tableWidth, tableHeight);

      // 添加模型质量图片到 PDF 中
      const qualityImgData = qualityCanvas.toDataURL('image/png');
      pdf.addImage(qualityImgData, 'PNG', 10, tableHeight + 120, qualityCanvas.width / dpi, qualityCanvas.height / dpi);
                // 保存 PDF 文件
      pdf.save("report_with_table_and_title_image.pdf");

    });

  };
}

// function report() {
//   const table = document.getElementById("result_table");
//   const modelElement = document.getElementById("model");
//   const modelText = modelElement.innerText;
//
//   // 创建一个新的 canvas 元素用于渲染标题
//   const titleCanvas = document.createElement('canvas');
//   const titleCtx = titleCanvas.getContext('2d');
//   const titleFontSize = 36; // 提高字体大小以提高清晰度
//   const titleFontFamily = 'Arial'; // 标题字体
//   const titleText = `${modelText}模型评估结果`; // 标题文本
//   titleCtx.font = `${titleFontSize}px ${titleFontFamily}`;
//   const titleWidth = titleCtx.measureText(titleText).width;
//
//   // 获取设备像素比
//   const dpi = 4;
//
//   // 设置标题画布分辨率
//   titleCanvas.width = (titleWidth + 20) * dpi; // 加上一些额外的宽度
//   titleCanvas.height = (titleFontSize + 20) * dpi; // 加上一些额外的高度
//
//   // 缩放标题画布
//   titleCtx.scale(dpi, dpi);
//
//   // 绘制白色背景
//   titleCtx.fillStyle = 'white';
//   titleCtx.fillRect(0, 0, titleCanvas.width, titleCanvas.height);
//
//   // 绘制标题文本
//   titleCtx.fillStyle = 'black';
//   titleCtx.font = `${titleFontSize}px ${titleFontFamily}`;
//   titleCtx.fillText(titleText, 10, titleFontSize + 10);
//
//   // 创建一个新的 jsPDF 实例
//   const pdf = new jsPDF('p', 'pt', 'a4');
//
//   // 添加 logo 到 PDF 左上方
//   const logo = new Image();
//   logo.src = 'static/logo.png'; // 加载 logo 图片
//   logo.onload = function() {
//     const logoHeight = 70; // 设置 logo 高度
//     pdf.addImage(logo, 'PNG', 10, 10, logoHeight * logo.width / logo.height, logoHeight);
//
//     // 添加标题图片到 PDF
//     const titleImgData = titleCanvas.toDataURL('image/png');
//     pdf.addImage(titleImgData, 'PNG', 80, 8, titleCanvas.width / dpi, titleCanvas.height / dpi);
//
//     // 使用 html2canvas 将 table 元素转换为 canvas
//     html2canvas(table, { dpi: 5 }).then(tableCanvas => {
//       // 计算表格转换为图片后的尺寸
//       const tableWidth = pdf.internal.pageSize.getWidth() - 20; // 表格宽度，留出边距
//       const tableHeight = tableCanvas.height * tableWidth / tableCanvas.width; // 根据宽度等比例缩放高度
//
//       // 将表格 canvas 转换为图片，并添加到 PDF 中
//       const tableImgData = tableCanvas.toDataURL('image/png');
//       pdf.addImage(tableImgData, 'PNG', 10, 80, tableWidth, tableHeight);
//
//       // 保存 PDF 文件
//       pdf.save("report_with_table_and_title_image.pdf");
//     });
//   };
// }



// function report(){  //生成检测报告
//   const doc = new jsPDF();
//   const table = document.getElementById("result_table");
//   const tableRows = table.rows;
//
//
//   // Save the PDF
//   doc.save("table_data.pdf");
// }

// function report(){  //生成检测报告
//   const doc = new jsPDF();
//   const table = document.getElementById("result_table");
//   const tableRows = table.rows;
//
//   // Add title
//   // var model_name = document.getElementById("model").innerText;
//   // doc.text(`Model <${model_name}> Evaluate Result\n\n\nFinal_Score:${final_score}  Security_Level:${final_level}`, 10, 10);
//   // var metrics = [
//   //   ["CACC", "ASR"] ,
//   //   ["MR-TA", "ACAC"] ,
//   //   ["ACTC", "NTE"] ,
//   //   ["ALD-p", "AQT"] ,
//   //   ["CCV", "CAV"] ,
//   //   ["COS", "RGB"] ,
//   //   ["RIC", "T-std"] ,
//   //   ["T-size", "CC"]
//   // ]
//   // var values = [
//   //   ["CACC", "ASR"] ,
//   //   ["MR-TA", "ACAC"] ,
//   //   ["ACTC", "NTE"] ,
//   //   ["ALD-p", "AQT"] ,
//   //   ["CCV", "CAV"] ,
//   //   ["COS", "RGB"] ,
//   //   ["RIC", "T-std"] ,
//   //   ["T-size", "CC"]
//   // ]
//   // for (let i = 1; i < tableRows.length; i++) {
//   //   const cells = tableRows[i].cells;
//   //   for (let j = 0; j < cells.length/2; j++) {
//   //     var v = cells[j*2+1].innerText;
//   //     values[i][j] = v;
//   //   }
//   // }
//   // // Add table data
//   // for (let i = 1; i < tableRows.length; i++) {
//   //   const rowData = [];
//   //   for (let j = 0; j < cells.length/2; j++) {
//   //     rowData.push("    ")
//   //     rowData.push(`${metrics[i-1][j]}:${values[i-1][j]}`);
//   //   }
//   //   doc.text(10, 20 + (i * 10), rowData.join("  \n  "));
//   // }
//   // Save the PDF
//   doc.save("table_data.pdf");
// }