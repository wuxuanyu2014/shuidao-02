<template>
  <div class="admin-login">
    <div class="login-container">
      <div class="login-form">
        <div class="login-header">
          <h2>农事服务中心</h2>
          <p>请输入您的登录信息</p>
        </div>
        
        <el-form 
          :model="loginForm" 
          :rules="rules" 
          ref="loginForm" 
          class="login-form-content"
        >
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              placeholder="请输入用户名"
              prefix-icon="el-icon-user"
              size="large"
              clearable
            ></el-input>
          </el-form-item>
          
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              prefix-icon="el-icon-lock"
              size="large"
              show-password
              @keyup.enter.native="handleLogin"
            ></el-input>
          </el-form-item>
          
          <el-form-item>
            <el-button 
              type="primary" 
              size="large" 
              :loading="loading"
              @click="handleLogin"
              class="login-btn"
            >
              {{ loading ? '登录中...' : '登录' }}
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminLogin',
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loading: false,
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate(async (valid) => {
        if (valid) {
          this.loading = true;
          try {
            // 这里可以调用您的登录接口
            await this.login();
          } catch (error) {
            console.error('登录失败:', error);
          } finally {
            this.loading = false;
          }
        }
      });
    },
    
    async login() {
      // 模拟登录请求，您可以替换为真实的API调用
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (this.loginForm.username === 'admin' && this.loginForm.password === '123456') {
            this.$message.success('登录成功！');
            // 保存特定的token到localStorage
            localStorage.setItem('adminToken', 'ADMIN_TOKEN_2024_NONGYE_CENTER');
            // 登录成功后跳转到后台主页面
            this.$router.push('/admin/dashboard');
            resolve();
          } else {
            this.$message.error('用户名或密码错误！');
            reject(new Error('用户名或密码错误'));
          }
        }, 1000);
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.admin-login {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-container {
  width: 100%;
  max-width: 400px;
}

.login-form {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
  
  h2 {
    color: #333;
    margin: 0 0 10px 0;
    font-size: 28px;
    font-weight: 600;
  }
  
  p {
    color: #666;
    margin: 0;
    font-size: 14px;
  }
}

.login-form-content {
  .el-form-item {
    margin-bottom: 24px;
  }
  
  .el-input {
    ::v-deep .el-input__inner {
      height: 48px;
      border-radius: 8px;
      border: 1px solid #dcdfe6;
      font-size: 16px;
      padding-left: 45px;
      
      &:focus {
        border-color: #667eea;
        box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
      }
    }
    
    ::v-deep .el-input__prefix {
      left: 12px;
      width: 30px;
      text-align: center;
      
      .el-input__icon {
        color: #999;
        font-size: 18px;
        line-height: 48px;
      }
    }
  }
}

.login-btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  
  &:hover {
    background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
  }
  
  &.is-loading {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }
}

// 响应式设计
@media (max-width: 480px) {
  .login-form {
    padding: 30px 20px;
  }
  
  .login-header h2 {
    font-size: 24px;
  }
}
</style> 