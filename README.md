# bunbunbun

#ah
http://bun.steememory.com:3000/api/condenser_api.get_account_history/{account:yasu,start:-1,limit:10}

http://bun.steememory.com:3000/method/condenser_api.get_discussions_by_created/[{"tag":"photography","limit":10,"truncate_body":0}]

#hivemind
O
http://bun.steememory.com:3000/api/condenser_api.get_blog/["yasu", 0, 1]

O
http://bun.steememory.com:3000/api/condenser_api.get_blog/{account:"yasu",start_entry_id:0,limit:1}


http://bun.steememory.com:3000/api/condenser_api.get_blog/[%22yasu%22,%200,%201]

----------------------------------------------------------------------------------
NG
http://bun.steememory.com:3000/api/condenser_api.get_account_history/{account:"yasu",start:-1,limit:1}

OK
http://bun.steememory.com:3000/api/condenser_api.get_account_history/["yasu",-1,1]

NG
curl -s --data '{"jsonrpc":"2.0", "method":"condenser_api.get_account_history", "params":{account:"yasu",start:-1,limit:1}, "id":1}' https://api.steememory.com

OK
curl -s --data '{"jsonrpc":"2.0", "method":"condenser_api.get_account_history", "params":["yasu", -1, 1], "id":1}' https://api.steememory.com
----------------------------------------------------------------------------------
