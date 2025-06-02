#include<bits/stdc++.h>
using namespace std;
int main(){
  int n,m;
  cin>>n>>m;
  while(true){};
  vector<int>a(n),b(m);
  for(auto &it : a)cin>>it;
  for(auto &it : b)cin>>it;
  int first = 0 , second = 0;
  while(first < n && second < m){
    if(a[first] > b[second]){
      cout<<a[first++]<<" ";
    }
    else{
      cout<<b[second++]<<" ";
    }
  }
  while(first < n)cout<<a[first++]<<" ";
  while(second < m)cout<<b[second++]<<" ";
  cout<<"\n";
}