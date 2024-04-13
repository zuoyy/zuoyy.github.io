title: 用Keytool和OpenSSL生成和签发数字证书
date: 2014-05-28 18:13:38
categories: 技术
---

---
JAVA Keytool
---
>JDK目录%JAVA_HOME%/bin提供了密钥库管理工具Keytool，用于管理密钥、证书和证书链。Keytool也可以用来管理对称加密算法中的密钥。

最简单的命令是生成一个自签名的证书，并把它放到指定的keystore文件中：

    keytool -genkey -alias tomcat -keyalg RSA -keystore c:/mykey

注意，公共名称(cn)应该是服务器的域名。这样keystore中就存在一个别名为tomcat的实体，它包括公钥、私钥和证书。这个证书是自签名的。

<!--more-->

下面用Keytool生成CSR（Certificate Signing Request），并用OpenSSL生成CA签名的证书,OpenSSL就不在这介绍了。

1. 准备
---

    1) 在bin目录下新建目录 demoCA、demoCA/certs、demoCA/newcerts
    2) 在demoCA建立一个空文件 index.txt
    3) 在demoCA建立一个文本文件 serial, 没有扩展名，内容是一个合法的16进制数字，例如 0000
    4) 配置环境变量PATH，加入%JAVA_HOME%/bin，本文用的JavaSDK1.6
    
2. 生成CA的自签名证书
---
    openssl req -new -x509 -keyout ca.key -out ca.crt -config openssl.cnf
    
3. 生成server端证书
---
1)生成KeyPair生成密钥对

    keytool -genkey -alias tomcat_server -validity 365 -keyalg RSA -keysize 1024 -keypass 123456  -storepass 123456 -keystore server_keystore
    
输入common name时，要和服务器的域名保持一致。

2)生成证书签名请求

    keytool -certreq -alias tomcat_server -sigalg MD5withRSA -file tomcat_server.csr -keypass 123456 -storepass 123456 -keystore server_keystore
    
3)用CA私钥进行签名，也可以到权威机构申请CA签名。

    openssl ca -in tomcat_server.csr -out tomcat_server.crt -cert ca.crt -keyfile ca.key -notext -config openssl.cnf
    
其中-notext表示不要把证书文件的明文内容输出到文件中去，否则在后面用keytool导入到keystore时会出错。

4)导入信任的CA根证书到keystore

    keytool -import -v -trustcacerts  -alias my_ca_root -file ca.crt -storepass 123456 -keystore server_keystore
    
5)把CA签名后的server端证书导入keystore

    keytool -import -v -alias tomcat_server -file tomcat_server.crt -storepass 123456 -keystore server_keystore
    
6)查看server端证书

    keytool -list -v -keystore server_keystore
    
可以看到tomcat_server的证书链长度是2

4. 生成client端证书
---
1)生成客户端CSR

    openssl genrsa -des3 -out tomcat_client.key 1024
    openssl req -new -key tomcat_client.key -out tomcat_client.csr -confi openssl.cnf
    
2)用CA私钥进行签名，也可以到权威机构申请CA签名

    openssl ca -in tomcat_client.csr -out tomcat_client.crt -cert ca.crt -keyfile ca.key -notext -config openssl.cnf
    
3)生成PKCS12格式证书

    openssl pkcs12 -export -inkey tomcat_client.key -in tomcat_client.crt -out  tomcat_client.p12
    
4)使用Keytool列出pkcs12证书的内容

    keytool -rfc -list -keystore tomcat_client.p12 -storetype pkcs12
















