# AI Defender
深度学习模型安全评测平台

## 系统和环境要求
- 系统要求
  - Windows 10 及以上系统
- 环境要求
  - python 3.10
  - 执行`pip install -rrequirments.txt`安装所需依赖

## app使用方法
- 默认评测
环境配置完毕后，在当前目录，执行`python app.py`。功能主页如下图所示，点击开始测评即可开始工作。评测根据模型大小耗时1-3小时不等。评测过程中可以在后台终端看到进度和输出，最终的各项指标和模型总评会显示在前端界面上。（第一次运行可能会下载样例模型，持续数分钟，属于正常情况）
![](https://notes.sjtu.edu.cn/uploads/upload_f788302a9e1a17fbb5ae38ac3674eef8.png)
- 个性化评测
  项目内置了一个样例模型用来评测，若希望评测自己的模型，则需要在`Source\EvaluationConfig.py`做修改，加载自己的模型结构和参数。
  ![](https://notes.sjtu.edu.cn/uploads/upload_aa7905a75ba9bb066f686f317b79859d.png) 
