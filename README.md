# jQeury picTags #
###為圖片加上標示用的標籤 (像是 Facebook 的照片)###
===

[Demo for basic](http://hsin.tw/tools/picTags/)

[Demo for edit](http://hsin.tw/tools/picTags/edit.html)

Edited from [https://github.com/timseverien/taggd](https://github.com/timseverien/taggd)

Here will only show what is add, please go to [taggd](https://github.com/timseverien/taggd) to see other original usages.

這裡只說明新增的功能，其餘用法請前往 [taggd](https://github.com/timseverien/taggd) 檢視。


### 1. Add individual position for every record ###

Look at the **position** property, you can set individual position for every record. If not set, it will follow the rules of **options**.
There are four choices : 
top, bottom, left, right.

看到新增的 **position** 屬性，現在可以為個別資料設定位置，如果沒有設定，則是依照 **options** 中的原始設定。有四個選項可以設定： top, bottom, left, right 。

```javascript
	var options = {
        // Aligning the text popups
        align: {
            x: 'center', // left, center or right
            y: 'top' // top, center or bottom
        },
        // The (relative) offset of the popups in pixels
        offset: {
            left: 0, // horizontal offset
            top: 20 // vertical offset
        }
	};

	var data = [
		{
            x: 0.35,
            y: 0.4,
            text: '狗狗汪汪叫' 
            ,attributes: {
                id: 'dog', // id is necessary
            },
            position: 'left' // top, bottom, left, right
        },
		{
            x: 0.8,
            y: 0.2,
            text: '沒有指定 position, 則是依照 options 中的規則' 
            ,attributes: {
                id: 'nothing', // id is necessary
            },
            
            // If not set, it will follow the rules of options.
            //position: 'right' // top, bottom, left, right
        },
	];
    
```


### 2. ID attribute is necessary ###

It is for update data usage.

為了更新資料需求， ID 屬性一定要填寫。


### 3. Update data ###

Add a method **updateInfo** for update data.

新增一個更新資料的方法 **updateInfo**

```javascript
	var options = {
    	edit: true,
     align: {},
     offset: {},
		updateInfo : function(save_data){
    		alert('id : ' + save_data.id +'\ntitle : ' + save_data.title +'\nx : ' + save_data.x +'\ny : ' + save_data.y);
    		/*
    		// here you will get id, title, x, y
    		// new record's id will be "new"
    		// you should give it a unique id like below

            var info = 'id='+ save_data.id 
                        + '&title=' + save_data.title
                        + '&x=' + save_data.x
                        + '&y=' + save_data.y;

            $.post( '/whereYouHandleIt', info, function( return_data ) {

                // update the new record's id
                $.each(picTags.data, function(i, v) {
                    if (v.attributes.id == 'new') {
                        if (save_data.title == v.text) {
                            v.attributes = {id:return_data.info.id};
                        }
                    }
                });

                // remove all records not be saved
                picTags.data = $.grep(picTags.data, function(v) {
    			    return (v.attributes.id != 'new');
				});
				picTags.addDOM();

            }, "json");
    		*/
		}
	};
```


### 4. Delete data manually ###

I remove the delete button and it have to delete manually.

// 刪除了 delete 按鈕，現在需要手動刪除，刪除的方式如下。

```javascript
    // delete a record manually
    function delete_record(id) {
        picTags.data = $.grep(picTags.data, function(v) {
    	    return (v.attributes.id != id);
		});
		picTags.addDOM();
    }
```


