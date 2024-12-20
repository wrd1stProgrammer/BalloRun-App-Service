import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const LoginScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>임시</Text>
      
      <View style={styles.inputContainer}>
        <TextInput style={styles.input} placeholder="ID"/>
      </View>

      <View style={styles.inputContainer}>
        <TextInput style={styles.input} placeholder="password" secureTextEntry/>
      </View>
      

      <TouchableOpacity style={styles.loginButton}>
        <Text style={styles.loginButtonText}>로그인</Text>
      </TouchableOpacity>

      <Text style={styles.forgotText}>Forgot your password? <Text style={styles.getHelp}>Get help</Text></Text>

      <View style={styles.dividerContainer}>
        <View style={styles.divider}/>
        <Text style={styles.dividerText}>Or log in with</Text>
        <View style={styles.divider}/>
      </View>

      <View style={styles.socialContainer}>
        <TouchableOpacity style={[styles.socialButton, {backgroundColor:'#3b5998'}]}>
          <Text style={styles.socialButtonText}>f</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.socialButton, {backgroundColor:'#DB4437'}]}>
          <Text style={styles.socialButtonText}>G</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.socialButton, {backgroundColor:'#1DA1F2'}]}>
          <Text style={styles.socialButtonText}>t</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#fff',
    paddingHorizontal: 30,
    paddingTop: 80,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    alignSelf:'center',
    marginBottom:10
  },
  subTitle: {
    fontSize:14,
    color:'#666',
    textAlign:'center',
    marginBottom:40
  },
  inputContainer: {
    marginBottom:20
  },
  inputLabel: {
    fontSize:14,
    color:'#555',
    marginBottom:5
  },
  input: {
    borderBottomWidth:1,
    borderBottomColor:'red',
    paddingVertical:5
  },
  rememberMeContainer: {
    flexDirection:'row',
    justifyContent:'flex-start',
    alignItems:'center',
    marginBottom:30
  },
  checkBoxContainer: {
    flexDirection:'row',
    alignItems:'center'
  },
  rememberMeText: {
    marginLeft:8,
    fontSize:14,
    color:'#333'
  },
  loginButton: {
    backgroundColor:'#F44336',
    borderRadius:5,
    paddingVertical:12,
    alignItems:'center',
    marginBottom:20
  },
  loginButtonText: {
    color:'#fff',
    fontSize:16,
    fontWeight:'bold'
  },
  forgotText: {
    fontSize:14,
    color:'#666',
    textAlign:'center',
    marginBottom:30
  },
  getHelp: {
    color:'#007BFF',
    textDecorationLine:'underline'
  },
  dividerContainer: {
    flexDirection:'row',
    alignItems:'center',
    marginBottom:30
  },
  divider: {
    flex:1,
    height:1,
    backgroundColor:'#ccc'
  },
  dividerText: {
    marginHorizontal:10,
    color:'#666'
  },
  socialContainer: {
    flexDirection:'row',
    justifyContent:'center'
  },
  socialButton: {
    width:50,
    height:50,
    borderRadius:25,
    justifyContent:'center',
    alignItems:'center',
    marginHorizontal:10
  },
  socialButtonText: {
    color:'#fff',
    fontSize:18,
    fontWeight:'bold'
  }
});
