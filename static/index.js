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
  //拿到前端数据
  const table = document.getElementById("result_table");
  const modelElement = document.getElementById("model");
  const modelText = modelElement.innerText;

  // 获取表格中的指标值
  CAACValue = parseFloat(document.getElementById("CACC").innerText);
  ASRValue = parseFloat(document.getElementById("ASR").innerText);
  MRTAValue = parseFloat(document.getElementById("MRTA").innerText);
  ACACValue = parseFloat(document.getElementById("ACAC").innerText);
  ACTCValue = parseFloat(document.getElementById("ACTC").innerText);
  NTEValue = parseFloat(document.getElementById("NTE").innerText);
  ALDPValue = parseFloat(document.getElementById("ALDP").innerText);
  AQTValue = parseFloat(document.getElementById("AQT").innerText);
  CCVValue = parseFloat(document.getElementById("CCV").innerText);
  CAVValue = parseFloat(document.getElementById("CAV").innerText);
  COSValue = parseFloat(document.getElementById("COS").innerText);
  RGBValue = parseFloat(document.getElementById("RGB").innerText);
  RICValue = parseFloat(document.getElementById("RIC").innerText);
  TSTDValue = parseFloat(document.getElementById("TSTD").innerText);
  TSIZEValue = parseFloat(document.getElementById("TSIZE").innerText);
  CCValue = parseFloat(document.getElementById("CC").innerText);

  if(CAACValue>=0&&CAACValue<=100){
  }else {
    alert("正在检测中，无法生成报告")
    return
  }

  //计算方式待定
  // poisontotalValue =  Math.floor(Math.random() * 100) + 1;
  // BackdoorValue =  Math.floor(Math.random() * 100) + 1;
  // AdversarialVAlue = Math.floor(Math.random() * 100) + 1;
  // TotalValue =poisontotalValue+BackdoorValue+AdversarialVAlue;

  poisontotalValue =  (CAACValue+ASRValue+ACACValue+ACTCValue+ALDPValue+CCVValue+CAVValue+COSValue+CCValue)/9;
  BackdoorValue =  (CAACValue+ASRValue+ACACValue+ACTCValue+ALDPValue+CCVValue+CAVValue+COSValue+CCValue+MRTAValue+TSTDValue+TSIZEValue)/12;
  AdversarialVAlue = (CAACValue+ASRValue+ACACValue+ACTCValue+ALDPValue+CCVValue+CAVValue+COSValue+CCValue+MRTAValue+NTEValue+AQTValue+RGBValue+RICValue)/14;
  TotalValue =poisontotalValue+BackdoorValue+AdversarialVAlue;
    // 创建一个新的 jsPDF 实例
  const pdf = new jsPDF('p', 'pt', 'a4');
    // 获取设备像素比
  const dpi = 2;

  //标题
  // 创建一个新的 canvas 元素用于渲染标题
  const titleCanvas = document.createElement('canvas');
  const titleCtx = titleCanvas.getContext('2d');
  const titleFontSize = 36; // 提高字体大小以提高清晰度
  const titleFontFamily = 'Arial'; // 标题字体
  const titleText = `${modelText}模型评估结果`; // 标题文本
  titleCtx.font = `${titleFontSize}px ${titleFontFamily}`;
  const titleWidth = titleCtx.measureText(titleText).width;

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

  //评价文字
  // 创建一个新的 canvas 元素用于渲染模型质量文字
  const qualityCanvas = document.createElement('canvas');
  const qualityCtx = qualityCanvas.getContext('2d');
  const qualityFontSize = 15; // 字体大小
  const qualityFontFamily = 'Arial'; // 字体

  // 根据指标和判断模型质量
  let qualityText = ''; // 初始化为空字符串
  if (poisontotalValue > 0 && poisontotalValue <= 30) {
     qualityText += `数据投毒攻击评价：差：${modelElement}模型在应对数据投毒攻击方面表现不佳。 它无法有效地识别和过滤恶意注入的数据，导致模型性能下降，甚至可能被攻击者完全破坏，从而严重影响系统的安全性和可靠性。\n`;
  } else if (poisontotalValue > 30 && poisontotalValue <= 70) {
     qualityText += `数据投毒攻击评价：一般：${modelElement}模型在应对数据投毒攻击方面表现一般。虽然它能够识别一些恶意注入的数据，但也存在一些漏洞和盲点，导致部分攻击可能会穿过模型的防御层，对系统造成一定程度的影响。\n`;
  } else if (poisontotalValue > 70 && poisontotalValue <= 100) {
     qualityText += "数据投毒攻击评价：好：在面对数据投毒攻击时，该模型表现出色。它能够有效地检测和过滤掉潜在的恶意注入数据，保持模型的准确性和稳定性，从而保护系统免受攻击的影响。\n";
  } else {
    qualityText += "数据投毒攻击评价：一般\n";
  }
  if (BackdoorValue >= 0 && BackdoorValue <= 40) {
     qualityText += `后门攻击评价：差：${modelElement}模型在面对后门攻击时表现不佳。它无法有效地识别和清除后门注入，导致模型性能严重下降甚至被攻击者完全破坏。\n`;
  } else if (BackdoorValue > 40 && BackdoorValue <= 70) {
     qualityText += `后门攻击评价：一般：${modelElement}模型在应对后门攻击时表现一般。虽然它能够识别一些后门注入并采取相应措施进行清除，但在面对更复杂或更隐蔽的后门攻击时表现较弱，可能存在一些漏洞或未知的后门类型。\n`;
  } else if (BackdoorValue > 70 && BackdoorValue <= 100) {
     qualityText += `后门攻击评价：好：${modelElement}模型在面对后门攻击时表现良好。它能够有效地检测并抵御后门注入，保持模型的准确性和稳定性。即使受到高级后门攻击的威胁，模型也能够及时发现并清除后门，确保系统的安全性和可靠性。\n`;
  } else {
     qualityText += "后门攻击评价：一般\n";
  }
    if (AdversarialVAlue >= 0 &&  AdversarialVAlue <= 40) {
     qualityText += `对抗样本攻击评价：差：${modelElement}模型在应对对抗样本攻击时表现差劲。它无法有效地识别和抵御对抗样本的攻击，导致模型性能严重下降甚至被攻击者完全破坏。\n`;
  } else if (AdversarialVAlue> 40 &&  AdversarialVAlue <= 70) {
     qualityText += `对抗样本攻击评价：一般：${modelElement}模型在应对对抗样本攻击时表现一般。虽然它能够在某些情况下有效地检测和抵御对抗样本的攻击，但在面对更复杂或更隐蔽的对抗攻击时表现较弱，模型可能存在一些盲点或漏洞。\n`;
  } else if (AdversarialVAlue > 70 &&  AdversarialVAlue <= 100) {
     qualityText += `对抗样本攻击评价：好：${modelElement}模型在面对对抗样本攻击时表现良好，具有高度鲁棒性，能够有效识别并抵御各种对抗样本的攻击。即使受到高级对抗样本的干扰，模型仍能保持高准确性和稳定性，维持其在各种场景下的有效性。\n`;
  } else {
     qualityText += "对抗样本攻击评价：一般\n";
  }
    if (TotalValue >= 0 &&  TotalValue  <= 90) {
     qualityText += `综合评价：差：${modelElement}模型在应对对抗样本攻击、后门攻击和数据投毒攻击方面表现不佳。它无法有效地识别和过滤恶意攻击，导致模型性能严重下降甚至被攻击者完全破坏。\n`;
  } else if (TotalValue > 90 &&  TotalValue  <= 180) {
     qualityText += `综合评价：一般：${modelElement}模型在应对对抗样本攻击、后门攻击和数据投毒攻击方面表现一般。虽然它能够识别一些恶意攻击并采取相应措施进行应对，但在面对更复杂或更隐蔽的攻击时表现较弱。\n`;
  } else if (TotalValue  > 180 &&  TotalValue  <= 300) {
     qualityText += `综合评价：好：${modelElement}模型在应对对抗样本攻击、后门攻击和数据投毒攻击时表现出色。它能够有效地检测和过滤各种恶意攻击，保持模型的准确性和稳定性，有效地保护系统免受各种安全威胁的影响。\n`;
  } else {
     qualityText += "综合评价：一般";
  }

  //此处按字数分行，如果按宽度分行出bug，可用这个
  // const maxCharactersPerLine = 30; // 每行最大字数
  // let lines = [];
  // let line = '';
  // for (let i = 0; i < qualityText.length; i++) {
  //     line += qualityText[i];
  //     if (line.length >= maxCharactersPerLine || qualityText[i] === '\n') {
  //         lines.push(line);
  //         line = '';
  //     }
  // }
  // if (line.length > 0) {
  //     lines.push(line); // 添加剩余的部分作为最后一行
  // }
  //换行
  const maxLineWidth = 340; // 每行最大宽度
  let lines = [];
  let line = '';
  let lineWidth = 0;

  for (let i = 0; i < qualityText.length; i++) {
      const char = qualityText[i];
      if (char === '\n') { // 遇到换行符时直接添加当前行，并重置当前行和宽度
          lines.push(line);
          line = '';
          lineWidth = 0;
      } else {
          const charWidth = qualityCtx.measureText(char).width; // 测量字符的宽度
          if (lineWidth + charWidth < maxLineWidth) { // 如果加上当前字符宽度后不超过最大宽度，则加入当前行
              line += char;
              lineWidth += charWidth;
          } else { // 否则新起一行
              lines.push(line);
              line = char;
              lineWidth = charWidth;
          }
      }
  }
  if (line) {
      lines.push(line); // 添加剩余的部分作为最后一行
  }

  // 设置画布尺寸
  qualityCanvas.width = 900 * dpi;
  qualityCanvas.height = (qualityFontSize + 50) * lines.length * dpi; // 估算每行高度

  // 绘制模型质量文本
  qualityCtx.scale(dpi, dpi);
  qualityCtx.fillStyle = 'black';
  qualityCtx.font = `${qualityFontSize}px ${qualityFontFamily}`;
  lines.forEach((line, index) => {
      qualityCtx.fillText(line, 0, (qualityFontSize + 11) * (index + 1)); //写下每一行，此处可以控制行间距
  });

  // 表格
  // 设置表格样式
  const cellPadding = 5;
  const cellWidth = 100;
  const cellHeight = 35;
  const headerHeight = 30;
  const tableWidth = (cellWidth * 4) + (cellPadding * 4);
  const tableHeight = (cellHeight + cellPadding) * 8 + headerHeight;
  const fontSize = 12;

  // 定义表头和数据
  const header = ["index", "result", "index", "result"];
  const data = [
      ["CACC", `${CAACValue}`, "ASR", `${ASRValue}`],
      ["MR_TA", `${MRTAValue}`, "ACAC", `${ACACValue}`],
      ["ACTC", `${ACTCValue}`, "NTE", `${NTEValue}`],
      ["ALD_p", `${ALDPValue}`, "AQT", `${AQTValue}`],
      ["CCV", `${CCVValue}`, "CAV", `${CAVValue}`],
      ["COS", `${COSValue}`, "RGB", `${RGBValue}`],
      ["RIC", `${RICValue}`, "T_std", `${TSTDValue}`],
      ["T_size", `${TSIZEValue}`, "CC", `${CCVValue}`]
  ];


  // 绘制表格边框和背景
  pdf.setDrawColor(0); // 黑色边框
  pdf.setFillColor(255); // 白色背景
  pdf.rect(65, 90, tableWidth+30, headerHeight, "FD");
  pdf.rect(65, 90 + headerHeight, tableWidth+30 , tableHeight - headerHeight-cellPadding-40, "FD");
  for (i =0;i<data.length;i++){
    pdf.rect(65,90 + headerHeight+i*(cellHeight) ,tableWidth+30 , cellHeight,"FD")
  }

  // 绘制表头
  pdf.setFontStyle("bold");
  for (let i = 0; i < header.length; i++) {
      pdf.text(header[i], 123 + cellPadding + (cellWidth * i), 95 + headerHeight / 2, { align: "center", baseline: "middle" });
  }

  // 绘制数据行
  pdf.setFontStyle("normal");
  for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i].length; j++) {
          pdf.text(data[i][j], 123 + cellPadding + (cellWidth * j), 110 + headerHeight + cellPadding + (cellHeight * i), { align: "center", baseline: "middle" });
      }
  }

  // 添加 logo 到 PDF 左上方
  const logo = new Image();
  logo.src = 'static/logo.png'; // 加载 logo 图片

  //开始将元素放到PDF上
  const logoHeight = 70; // 设置 logo 高度
  pdf.addImage(logo, 'PNG', 40, 10, logoHeight * logo.width / logo.height, logoHeight);

    // 添加标题图片到 PDF
  const titleImgData = titleCanvas.toDataURL('image/png');
  pdf.addImage(titleImgData, 'PNG', 120, 8, titleCanvas.width / dpi, titleCanvas.height / dpi);

      // 添加模型质量图片到 PDF 中
  const qualityImgData = qualityCanvas.toDataURL('image/png');
  pdf.addImage(qualityImgData, 'PNG', 40, tableHeight + 60, qualityCanvas.width / dpi, qualityCanvas.height / dpi);
  // 保存 PDF 文件
  pdf.save("report_with_table_and_title_image.pdf");

}


// function report() {
//   const table = document.getElementById("result_table");
//   const modelElement = document.getElementById("model");
//   const modelText = modelElement.innerText;
//
//   // 获取表格中的指标值
//   const CAACValue = parseFloat(document.getElementById("CACC").innerText);
//   const ASRValue = parseFloat(document.getElementById("ASR").innerText);
//   const MRTAValue = parseFloat(document.getElementById("MRTA").innerText);
//   const ACACValue = parseFloat(document.getElementById("ACAC").innerText);
//   const ACTCValue = parseFloat(document.getElementById("ACTC").innerText);
//   const NTEValue = parseFloat(document.getElementById("NTE").innerText);
//   const ALDPValue = parseFloat(document.getElementById("ALD").innerText);
//   const AQTValue = parseFloat(document.getElementById("AQT").innerText);
//   const CCVValue = parseFloat(document.getElementById("CCV").innerText);
//   const CAVValue = parseFloat(document.getElementById("CAV").innerText);
//   const COSValue = parseFloat(document.getElementById("COS").innerText);
//   const RGBValue = parseFloat(document.getElementById("RGB").innerText);
//   const RICValue = parseFloat(document.getElementById("RIC").innerText);
//   const TSTDValue = parseFloat(document.getElementById("TSTD").innerText);
//   const TSIZEValue = parseFloat(document.getElementById("TSIZE").innerText);
//   const CCValue = parseFloat(document.getElementById("CC").innerText);
//
//   poisontotalValue = 3;
//   BackdoorValue = 3;
//   Adversarial =3;
//
//
//     // 获取设备像素比
//   const dpi = 4;
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
//   // 创建一个新的 canvas 元素用于渲染模型质量文字
//   const qualityCanvas = document.createElement('canvas');
//   const qualityCtx = qualityCanvas.getContext('2d');
//   const qualityFontSize = 18; // 字体大小
//   const qualityFontFamily = 'Arial'; // 字体
//
//   // 根据指标和判断模型质量
//   let qualityText = ''; // 初始化为空字符串
//   if (poisontotalValue >= 0 && poisontotalValue <= 30) {
//      qualityText = "数据投毒攻击评价：差：模型在应对数据投毒攻击方面表现不佳。它无 法有效地识别和过滤恶意注入的数据，导致模型性能下降，甚至可能被 攻击者完全破坏，从而严重影响系统的安全性和可靠性。";//31字符为1行
//   } else if (poisontotalValue > 30 && poisontotalValue <= 60) {
//      qualityText = "数据投毒攻击评价：一般：模型在应对数据投毒攻击方面表现一般。虽 然它能够识别一些恶意注入的数据，但也存在一些漏洞和盲点，导致部分攻击可能会穿过模型 的防御层，对系统造成一定程度的影响。";
//   } else if (poisontotalValue > 60 && poisontotalValue <= 100) {
//      qualityText = "数据投毒攻击评价：好：在面对数据投毒攻击时，该模型表现出色。它 能够有效地检测和过滤掉潜在的恶意注入数据，保持模型的准确性和稳 定性，从而保护系统免受攻击的影响。";
//   } else {
//      qualityText = "模型未评分";
//   }
//
//   // 获取每行文本的最大宽度
//   const maxLineWidth = 120; // 设置每行文本的最大宽度
//   let lines = [];
//   let line = '';
//   const words = qualityText.split(' ');
//   for (let i = 0; i < words.length; i++) {
//       const testLine = line + words[i] + ' ';
//       const testWidth = qualityCtx.measureText(testLine).width;
//       if (testWidth > maxLineWidth) {
//           lines.push(line);
//           line = words[i] + '  ';
//       } else {
//           line = testLine;
//       }
//   }
//   lines.push(line); // 添加最后一行
//
//   // 设置画布尺寸
//   qualityCanvas.width = (maxLineWidth+450) * dpi;
//   qualityCanvas.height = (qualityFontSize + 50) * lines.length * dpi; // 估算每行高度
//
//   // 绘制模型质量文本
//   qualityCtx.scale(dpi, dpi);
//   qualityCtx.fillStyle = 'black';
//   qualityCtx.font = `${qualityFontSize}px ${qualityFontFamily}`;
//   lines.forEach((line, index) => {
//       qualityCtx.fillText(line, 0, (qualityFontSize + 5) * (index + 1));
//   });
//
//   // 创建一个新的 canvas 元素用于渲染表格
//     const tableCanvas = document.createElement('canvas');
//     const tableCtx = tableCanvas.getContext('2d');
//
//     const content = [
//     { index: 'CACC', result: '20' },
//     { index: 'ASR', result: '--' },
//     // 其他行的内容可以类似地添加
//      ];
//
//     // 设置单元格尺寸和表格尺寸
//     const cellPadding = 5; // 单元格内边距
//     const cellWidth = 30; // 单元格宽度
//     const cellHeight = 10; // 单元格高度
//     const headerHeight = 10; // 表头高度
//     const tableWidth = (cellWidth * 2 + cellPadding * 2)*8 ; // 根据单元格宽度和内边距计算表格宽度
//     const tableHeight = (content.length + 1) * cellHeight + headerHeight+100 ; // 根据单元格高度、表头高度和内容行数计算表格高度
//
//     // 缩放表格画布
//     tableCanvas.width = tableWidth;
//     tableCanvas.height = tableHeight;
//     tableCtx.scale(dpi, dpi);
//
//     // 设置表格样式
//     tableCtx.fillStyle = 'white'; // 设置表格背景颜色为白色
//     tableCtx.fillRect(0, 0, tableWidth, tableHeight); // 绘制表格背景
//     tableCtx.strokeStyle = 'black'; // 设置边框颜色
//     tableCtx.lineWidth = 1; // 设置边框宽度
//
//     // 绘制表头
//     tableCtx.fillRect(0, 0, tableWidth, headerHeight); // 绘制表头背景
//     tableCtx.strokeRect(0, 0, tableWidth, headerHeight); // 绘制表头边框
//     tableCtx.font = 'bold 8px Arial'; // 设置表头字体样式
//     tableCtx.fillStyle = 'black'; // 设置表头字体颜色
//     tableCtx.textAlign = 'center'; // 设置文字居中对齐
//     tableCtx.textBaseline = 'middle'; // 设置文字垂直居中对齐
//     tableCtx.fillText('指标', cellWidth / 2, headerHeight / 2); // 绘制第一列表头
//     tableCtx.fillText('结果', cellWidth / 2 + cellWidth, headerHeight / 2); // 绘制第二列表头
//     tableCtx.fillText('指标', cellWidth / 2 + cellWidth*2, headerHeight / 2); // 绘制第一列表头
//     tableCtx.fillText('结果', cellWidth / 2 + cellWidth*3, headerHeight / 2); // 绘制第二列表头
//
//     // 绘制表格内容
//     tableCtx.font = '16px Arial'; // 设置内容字体样式
//     tableCtx.fillStyle = 'black'; // 设置内容字体颜色
//     for ( i = 0; i < content.length; i++) {
//       const rowY = headerHeight + (i * cellHeight); // 计算当前行的Y坐标
//       tableCtx.fillRect(0, rowY, tableWidth, cellHeight); // 绘制单元格背景
//       tableCtx.strokeRect(0, rowY, tableWidth, cellHeight); // 绘制单元格边框
//       tableCtx.textAlign = 'center'; // 设置文字居中对齐
//       tableCtx.textBaseline = 'middle'; // 设置文字垂直居中对齐
//       tableCtx.fillText(content[i].index, cellWidth / 2, rowY + cellHeight / 2); // 绘制第一列内容
//       tableCtx.fillText(content[i].result, cellWidth / 2 + cellWidth, rowY + cellHeight / 2); // 绘制第二列内容
//     }
//
//
//   // 创建一个新的 jsPDF 实例
//   const pdf = new jsPDF('p', 'pt', 'a4');
//
//   const logo = new Image();
//   logo.src = 'static/logo.png'; // 加载 logo 图片
//   logo.onload = function () {
//     const logoHeight = 70; // 设置 logo 高度
//     pdf.addImage(logo, 'PNG', 10, 10, logoHeight * logo.width / logo.height, logoHeight);
//
//     // 添加标题图片到 PDF
//     const titleImgData = titleCanvas.toDataURL('image/png');
//     pdf.addImage(titleImgData, 'PNG', 80, 8, titleCanvas.width / dpi, titleCanvas.height / dpi);
//
//
//
//
//     // 将表格 canvas 转换为图片，并添加到 PDF 中
//     const tableImgData = tableCanvas.toDataURL('image/png');
//     pdf.addImage(tableImgData, 'PNG', 10, 90, tableWidth , tableHeight );
//
//     // 将模型质量 canvas 转换为图片，并添加到 PDF 中
//     const qualityImgData = qualityCanvas.toDataURL('image/png');
//     pdf.addImage(qualityImgData, 'PNG', 10, tableHeight + 100, qualityCanvas.width / dpi, qualityCanvas.height / dpi);
//
//     // 保存 PDF 文件
//     pdf.save("report_with_table_and_title_image.pdf");
//   };
// }

