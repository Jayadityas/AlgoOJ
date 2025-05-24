#include <bits/stdc++.h>
using namespace std;
int main(){

  int n;
  cin>>n;
  vector<int>v(n);
  for(auto &it : v)cin>>it;
  cout<<*max_element(v.begin(),v.end())<<"\n";
}