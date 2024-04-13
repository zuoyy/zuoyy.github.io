title: Redis系列-存储篇list操作
date: 2015-07-24 13:45:53
categories: 技术
---

list相关概念
* 列表：一个从左到右的队列，类似于一个栈，常规模式下，先进列表的元素，后出。
* 表头元素：列表最左端第一个元素。
* 表尾元素：列表最右端的最后一个元素。不包含任何元素的列表成为空列表。

<!--more-->

1.新增
---
>lpush
>语法：lpush key value[value]

解释：把一个或多个元素插入表头。如果是多个value时，按照从左到右的次序插。返回插入元素的个数

    [root@xsf001 ~]# redis-cli  
    redis 127.0.0.1:6379> lpush lst.user zhangsan   #插入一个元素  
    (integer) 1  
    redis 127.0.0.1:6379> lpush lst.user zhangsan lisi   #插入多个元素，list中允许插入重复的元素  
    (integer) 3 
    

>lpushx
>语法：lpushx key value

解释：插入一个表头元素，当且仅当列表key存在时，才能插入。返回列表中元素的个数

    redis 127.0.0.1:6379> lpushx lst.user wangwu   #列表存在  
    (integer) 4  
    redis 127.0.0.1:6379> lpushx lst.tech wangwu   #列表不存在，不插入  
    (integer) 0 
    

>rpush
>语法：rpush key [value]

解释：将一个或多个值插入到队列的队尾。多值时，从左到右依次添加。返回列表中元素个数

    redis 127.0.0.1:6379> rpush lst.user ls005     #列表存在  
    (integer) 5  
    redis 127.0.0.1:6379> rpush lst.tech tec01 tec02 tec03  #列表不存在  
    (integer) 3 
    

>rpushx
>语法：rpushx key value

解释：讲值插入到列表队尾，当且仅当列表key存在时，才添加。返回列表元素个数

    redis 127.0.0.1:6379> rpushx lst.tech tec04  #key 存在  
    (integer) 4  
    redis 127.0.0.1:6379> rpushx lst.sub englist #key 不存在  
    (integer) 0
    

>linsert
>语法：linsert key before|after pivot value

解释：将值插入到pivot的前面或后面。返回列表元素个数。如果参照点pivot不存在不插入。如果有多个pivot，以离表头最近的为准

    redis 127.0.0.1:6379> linsert lst.tech after tec04 tec06  #后面插  
    (integer) 5   
    redis 127.0.0.1:6379> linsert lst.tech before tec06 tec05 #前面插  
    (integer) 6   
    redis 127.0.0.1:6379> linsert lst.tech before tec08 tec07 #参照点不存在，不插  
    (integer) -1  
    redis 127.0.0.1:6379> linsert lst.user after zhangsan zhangsan01  #列表中有多个pivot，以从左到右的第一个为准  
    (integer) 6
    

2.查询
---
>lindex
>语法：lindex key index

解释：通过索引index获取列表的元素。 index>=0时， 0 表头，1 第二个元素，依次类推；index<0时，-1，表尾，-2倒数第二个元素，依次类推

    redis 127.0.0.1:6379> lindex lst.user 0  #表头  
    "wangwu"   
    redis 127.0.0.1:6379> lindex lst.user -1 #表尾  
    "ls005"  
    redis 127.0.0.1:6379> lindex lst.user 2 #第三个元素  
    "zhangsan"  
    redis 127.0.0.1:6379> lindex lst.user -2 #倒数第二个元素  
    "zhangsan" 

>lrange
>语法：lrange key start stop

解释：获取指定开始和结束范围的一些列元素。0：表头，-1：表尾。如果stop指定的元素在start的左边，返回空列表

    redis 127.0.0.1:6379> lrange lst.user 0 -1 #返回所有  
    1) "wangwu"  
    2) "lisi"  
    3) "zhangsan"  
    4) "zhangsan01"  
    5) "zhangsan"  
    6) "ls005"  
    redis 127.0.0.1:6379> lrange lst.user -1 0  #返回空  
    (empty list or set)  
    redis 127.0.0.1:6379> lrange lst.user 1 2  #返回多个  
    1) "lisi"  
    2) "zhangsan"  
    redis 127.0.0.1:6379> lrange lst.user 1 1   #返回一个元素  
    1) "lisi"
    

3.修改
---
>lset
>语法：lset key index value

解释：设置列表指定索引的值，如果指定索引不存在则报错

    redis 127.0.0.1:6379> lset lst.user 2 zhangsan1  #设置第三个元素为zhangsan1  
    OK  
    redis 127.0.0.1:6379> lrange lst.user 0 -1  
    1) "wangwu"  
    2) "lisi"  
    3) "zhangsan1"  
    4) "zhangsan01"  
    5) "zhangsan"  
    6) "ls005"  
    redis 127.0.0.1:6379> lset lst.user 6 ls006  #指定索引不存在  
    (error) ERR index out of range
    

4.删除
---
>ltrim
>语法：ltrim key start stop

解释：保留指定区域的元素，其他元素全部删除

    redis 127.0.0.1:6379> ltrim lst.user 0 -2  
    OK  
    redis 127.0.0.1:6379> lrange lst.user 0 -1  
    1) "wangwu"  
    2) "lisi"  
    3) "zhangsan1"  
    4) "zhangsan01"  
    5) "zhangsan"
    

>lrem
>语法：lrem key count value

解释：移除等于value的元素，当count>0时，从表头开始查找，移除count个；当count=0时，从表头开始查找，移除所有等于value的；当count<0时，从表尾开始查找，移除|count| 个。

    redis 127.0.0.1:6379> lrange lst.user 0 -1  
    1) "zhangsan"  
    2) "wangwu"  
    3) "lisi"  
    4) "zhangsan1"  
    5) "zhangsan01"  
    6) "zhangsan"  
    7) "lisi"  
    8) "zhangsan"  
    9) "lisi"  
    10) "zhangsan"  
    redis 127.0.0.1:6379> lrem lst.user 2 zhangsan #移除前两个zhangsan  
    (integer) 2  
    redis 127.0.0.1:6379> lrange lst.user 0 -1  
    1) "wangwu"  
    2) "lisi"  
    3) "zhangsan1"  
    4) "zhangsan01"  
    5) "lisi"  
    6) "zhangsan"  
    7) "lisi"  
    8) "zhangsan"  
    redis 127.0.0.1:6379> lrange lst.user -1 zhangsan #移除最后一个zhangsan  
    (empty list or set)  
    redis 127.0.0.1:6379> lrange lst.user 0 -1  
    1) "wangwu"  
    2) "lisi"  
    3) "zhangsan1"  
    4) "zhangsan01"  
    5) "lisi"  
    6) "zhangsan"  
    7) "lisi"  
    redis 127.0.0.1:6379> lrem lst.user 0 lisi  #移除所有lisi  
    (integer) 3  
    redis 127.0.0.1:6379> lrange lst.user 0 -1  
    1) "wangwu"  
    2) "zhangsan1"  
    3) "zhangsan01"  
    4) "zhangsan"  
    redis 127.0.0.1:6379> 
    

>rpop
>语法：rpop key

解释：移除并返回表尾元素

    redis 127.0.0.1:6379> rpop lst.user  
    "zhangsan"
    

>lpop
>语法：lpop key 

解释：移除并返回表尾元素
    
    redis 127.0.0.1:6379> lpop lst.user  
    "wangwu"
    

5.其他
---
>llen
>语法：llen key

解释：获取列表长度

    redis 127.0.0.1:6379> llen lst.user  
    (integer) 2

