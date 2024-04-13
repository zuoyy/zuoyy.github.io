title: MongoDB常用API总结
date: 2015-08-23 18:27:41
categories: 技术
---

>类转换

当把一个类对象存到mongoDB后，从mongoDB取出来时使用setObjectClass()将其转换回原来的类。

    public class Tweet implements DBObject { 
        /* ... */ 
    } 
    Tweet myTweet = new Tweet(); 
    myTweet.put("user", "bruce"); 
    myTweet.put("message", "fun"); 
    myTweet.put("date", new Date()); 
    collection.insert(myTweet); 
    //转换 
    collection.setObjectClass(Tweet.class); 
    Tweet myTweet = (Tweet)collection.findOne(); 
    

<!--more-->

>默认ID

当保存的对象没有设置ID时，mongoDB会默认给该条记录设置一个ID（"_id"）。
当然你也可以设置自己指定的ID，如：(在mongoDB中执行用db.users.save({_id:1,name:'bruce'});)

    BasicDBObject bo = new BasicDBObject();
    bo.put('_id', 1);
    bo.put('name', 'bruce');
    collection.insert(bo);
    
>权限

判断是否有mongoDB的访问权限，有就返回true，否则返回false。

    boolean auth = db.authenticate(myUserName, myPassword);
    
    
>查看mongoDB数据库列表

    Mongo m = new Mongo(); 
    for (String s : m.getDatabaseNames()) { 
        System.out.println(s); 
    }
    
>查看当前库下所有的表名，等于在mongoDB中执行showtables;

    Set colls = db.getCollectionNames(); 
    for (String s : colls) { 
        System.out.println(s); 
    }
    
>查看一个表的索引

    List list = coll.getIndexInfo(); 
    for (DBObject o : list) { 
        System.out.println(o); 
    } 
    
>删除一个数据库

    Mongo m = new Mongo(); 
    m.dropDatabase("myDatabaseName");
    
>建立mongoDB的链接

    Mongo m = new Mongo("localhost", 27017); //有多个重载方法，可根据需要选择
    DB db = m.getDB("myDatabaseName"); //相当于库名 
    DBCollection coll = db.getCollection("myUsersTable")；//相当于表名 
    

查询数据

>查询第一条记录

    DBObject firstDoc = coll.findOne(); 
    
findOne()返回一个记录，而find()返回的是DBCursor游标对象。

>查询全部数据

    DBCursor cur = coll.find(); 
    while(cur.hasNext()) { 
        System.out.println(cur.next()); 
    }
    
>查询记录数量

    coll.find().count(); 
    coll.find(new BasicDBObject("age", 26)).count();
    
>条件查询

    BasicDBObject condition = new BasicDBObject(); 
    condition.put("name", "bruce"); 
    condition.put("age", 26); 
    coll.find(condition);
    
>查询部分数据块

    DBCursor cursor = coll.find().skip(0).limit(10); 
    while(cursor.hasNext()) { 
        System.out.println(cursor.next()); 
    } 
    
>比较查询(age >50)

    BasicDBObject condition = new BasicDBObject(); 
    condition.put("age", new BasicDBObject("$gt",50)); 
    coll.find(condition);
    
>比较符

    "$gt"： 大于
    "$gte"：大于等于
    "$lt"： 小于
    "$lte"：小于等于
    "$in"： 包含
    //以下条件查询20<age<=30
    condition.put("age", new BasicDBObject("$gt",20).append("$lte", 30));
    

插入数据

>批量插入

    List datas = new ArrayList(); 
    for (int i=0; i < 100; i++) { 
        BasicDBObject bo = new BasicDBObject(); 
        bo.put("name", "bruce"); 
        bo.append("age", i); 
        datas.add(bo); 
    } 
    coll.insert(datas); 
    
又如：

    DBCollection coll = db.getCollection("testCollection");   
    for(int i=1; i<=100; i++) {//插入100条记录   
        User user = new User();   
        user.setName("user_"+i);  
        user.setPoint(i);   
        coll.insert(user);
    }
    
>正则表达式

查询所有名字匹配 /joh?n/i 的记录

    Pattern pattern = Pattern.compile("joh?n",CASE_INSENSITIVE); 
    BasicDBObject query = new BasicDBObject("name", pattern); 
    DBCursor cursor = coll.find(query);
