from bs4 import BeautifulSoup
import requests
f=open('output.txt','w+',encoding='gbk')
text=open('text.txt','r+',encoding='gbk')
soup=BeautifulSoup(text.read(),'lxml')
all_tr=soup.find('div',class_='postBody').find_all('tr')
for tr in soup.find('div',class_='postBody').find_all('tr'):
    try:
        id_=tr.find('td')
        url=tr.find('a')['href']
        #print(id_.get_text())
        print("\""+id_.get_text()+"\" :"+"\""+url+"\", ",end="",file=f)
    except:
        pass
    