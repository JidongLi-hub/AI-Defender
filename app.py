from flask import Flask, render_template, request, jsonify
import threading
from EvaluationConfig import *
from EvaluationPlatformNEW import ModelEvaluation, get_result
import time

def wait():
    time.sleep(8)

def go():
    ModelEvaluation(new_evalueation_params)

app = Flask(__name__, static_url_path='/static') # 指定静态文件路径

@app.route('/login')
def login():
    return render_template('Login.html')

@app.route('/register')
def register():
    return render_template('Register.html')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/detect', methods=['POST'])
def detect():
    data = request.json  # 收到来自前端的数据
    print(data)
    # 处理接收到的数据，进行评测，并返回响应给前端
    global new_evalueation_params
    new_evalueation_params = evaluation_params # 根据前端用户的需求，修改评测参数
    thread = threading.Thread(target=go) # 调用评测函数
    thread.start()
    thread.join() # 等待评测执行完成， 结果在全局变量result中
    response_data = get_result() # 需要在EvaluatePlatformNew中将结果指标保存到result中，并组织成相应格式
    print(response_data)

    return jsonify(response_data)


if __name__ == '__main__':
    app.run(debug=True)
