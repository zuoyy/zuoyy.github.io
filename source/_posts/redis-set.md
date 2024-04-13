title:  Redis系列-存储篇set操作
date: 2015-07-25 18:34:39
categories: 技术
---

>redis set 是string类型对象的无序集合，set不管存储多少对象，对存储对象的add，remove和test操作的时间复杂度是O(1)。set最多能包含 232 - 1 个member。

<!--more-->

1.增加
---
>语法：sadd key member[member...]

解释：对特定key的set增加一个或多个值，返回是增加元素的个数。注意：对同一个member多次add，set中只会保留一份。

    [root@xsf001 ~]# redis-cli   
    redis 127.0.0.1:6379> sadd stu zhangsan lisi wangwu #新增  
    (integer) 3  
    redis 127.0.0.1:6379> smembers stu    #得到set的所有member  
    1) "wangwu"  
    2) "lisi"  
    3) "zhangsan"  
    redis 127.0.0.1:6379> sadd stu zhangsan #增加存在的member  
    (integer) 0  
    redis 127.0.0.1:6379> smembers stu  
    1) "wangwu"  
    2) "lisi"  
    3) "zhangsan"  
    redis 127.0.0.1:6379> sadd tech wangwu liming joe  
    (integer) 3  
    redis 127.0.0.1:6379> sadd tech jim  
    (integer) 1  
    redis 127.0.0.1:6379> smembers tech  
    1) "jim"  
    2) "liming"  
    3) "wangwu"  
    4) "joe"
2.查询
---
>smembers
>语法：smembers key

解释：获取set中的所有member

    redis 127.0.0.1:6379> smembers stu  
    1) "wangwu"  
    2) "lisi"  
    3) "zhangsan"  
    redis 127.0.0.1:6379> smembers tech  
    1) "jim"  
    2) "liming"  
    3) "wangwu"  
    4) "joe" 
    

>sismember
>语法：sismember key member

解释：判断值是否是set的member。如果值是set的member返回1，否则，返回0

    redis 127.0.0.1:6379> sismember tech jim #jim 是set的member  
    (integer) 1  
    redis 127.0.0.1:6379> sismember tech jim001 #jim001 不是set的member  
    (integer) 0 
    

>scard
>语法：scard key

解释：返回set的member个数，如果set不存在，返回0

    redis 127.0.0.1:6379> scard tech  # tech 存在  
    (integer) 4  
    redis 127.0.0.1:6379> scard stud #stud 不存在  
    (integer) 0  
    redis 127.0.0.1:6379> scard stu  
    (integer) 4
    

>srandmember
>语法：srandmember key

解释：从set中返回一个随机member

    redis 127.0.0.1:6379> srandmember stu  
    "zhangsan"  
    redis 127.0.0.1:6379> srandmember stu  
    "zhangsan"  
    redis 127.0.0.1:6379> srandmember stu  
    "wangwu"  
    redis 127.0.0.1:6379> srandmember stu  
    "zhangsan01" 
    
3.删除
---
>spop
>语法：spop key

解释：移除并返回一个随机member

    redis 127.0.0.1:6379> smembers stu #pop前  
    1) "zhangsan01"  
    2) "wangwu"  
    3) "lisi"  
    4) "zhangsan"  
    redis 127.0.0.1:6379> spop stu  #移除一个随机member  
    "lisi"  
    redis 127.0.0.1:6379> smembers stu #pop后  
    1) "zhangsan01"<span style="white-space:pre">   </span>  
    2) "wangwu"  
    3) "zhangsan"
    
    

>srem
>语法：srem key member [member ...]

解释：移除一个或多个member

    redis 127.0.0.1:6379> smembers tech  
    1) "jim"  
    2) "liming"  
    3) "wangwu"  
    4) "joe"  
    redis 127.0.0.1:6379> srem tech jim   #移除jim  
    (integer) 1  
    redis 127.0.0.1:6379> smembers tech     
    1) "liming"  
    2) "wangwu"  
    3) "joe"  
    redis 127.0.0.1:6379> srem tech liming joe #移除多个member  
    (integer) 2  
    redis 127.0.0.1:6379> smembers tech  
    1) "wangwu"
    
    

>smove
>语法：smove source destination member

解释：将source中的member移动到destination

    redis 127.0.0.1:6379> smembers tech   #smove前  
    1) "wangwu"  
    redis 127.0.0.1:6379> smembers stu  
    1) "zhangsan01"  
    2) "wangwu"  
    3) "zhangsan"  
    redis 127.0.0.1:6379> smove stu tech zhangsan  #将zhangsan 从stu移动到tech  
    (integer) 1  
    redis 127.0.0.1:6379> smembers stu #smove后  
    1) "zhangsan01"  
    2) "wangwu"  
    redis 127.0.0.1:6379> smembers tech  
    1) "wangwu"  
    2) "zhangsan"
    

4.其他
---
>并集
>语法：sunion key[key...]

解释：多个set的并集

    redis 127.0.0.1:6379> smembers stu  
    1) "zhangsan01"  
    2) "wangwu"  
    redis 127.0.0.1:6379> sunion stu  
    1) "zhangsan01"  
    2) "wangwu"  
    redis 127.0.0.1:6379> smembers tech  
    1) "wangwu"  
    2) "zhangsan"  
    redis 127.0.0.1:6379> sunion stu tech  
    1) "zhangsan01"  
    2) "wangwu"  
    3) "zhangsan"
    
    

>把并集结果存储到set
>语法：sunionstore destination key [key ...]

解释：求多个set并集，并把结果存储到destination 

    redis 127.0.0.1:6379> sunionstore same stu tech #把stu tech并集结果存储在union  
    (integer) 3  
    redis 127.0.0.1:6379> smembers union  
    1) "zhangsan01"  
    2) "wangwu"  
    3) "zhangsan"
    
    

>交集
>语法：sinter key[key...]

解释：多个set的交集

    redis 127.0.0.1:6379> smembers stu  
    1) "zhangsan01"  
    2) "wangwu"  
    redis 127.0.0.1:6379> smembers tech  
    1) "wangwu"  
    2) "zhangsan"  
    redis 127.0.0.1:6379> sinter stu tech  
    1) "wangwu"
    

>把交集结果存储到指定set
>语法：sinterstore destination key [key ...]

解释：把多个set的交集结果存储到destination 

    redis 127.0.0.1:6379> sinterstore inter stu tech  
    (integer) 1  
    redis 127.0.0.1:6379> smembers inter  
    1) "wangwu"
    

>set中在其他set中不存在member
>语法：sdiff key[key ...]

    redis 127.0.0.1:6379>   
    redis 127.0.0.1:6379> smembers stu  
    1) "zhangsan01"  
    2) "wangwu"  
    redis 127.0.0.1:6379> smembers tech  
    1) "wangwu"  
    2) "zhangsan"  
    redis 127.0.0.1:6379> sdiff stu tech  
    1) "zhangsan01"  
    redis 127.0.0.1:6379> sdiff tech stu  
    1) "zhangsan"
    

>把set中在其他set中不存在的member存储到新的set
>语法：sdiffstore key[key...]

    redis 127.0.0.1:6379> sdiffstore diff stu tech  
    (integer) 1  
    redis 127.0.0.1:6379> smembers diff  
    1) "zhangsan01"
    

[http://redis.io/commands#set](http://redis.io/commands#set)
