     server {
        listen       80;
        server_name  a001.local;
  
        location / {
           proxy_cache                     off;
           proxy_pass https://www.sinoquebec.com/;
           proxy_redirect     off;
   
           #http://$host
           proxy_set_header   Host $host;
           sub_filter https://www.sinoquebec.com/ http://$host/;
           sub_filter http://sinoquebec.com/ http://$host/;
           #sub_filter http://sinoquebec.com/ /mms/;
           # sub_filter "http://sinoquebec.com/" "http://a001.local/";
           sub_filter_once off;
        } 
    }
