Version: 1.0.0
Author: Luiz Leite
Date: 25/07/2023

Requirements:

- Node 18.16+
- Mongo 6.0+
- Postgres 15+
- Oracle 11g+

Routes

- /actuator/heath

Configuration to call Oracle 11g

- sudo mkdir -p /opt/oracle
- cd /opt/oracle
- sudo unzip instanteclient-baseiclite-linux.x64-21.11.0.0.0dbru.zip
- sudo apt-get install libaio1
- nano ~/.bashrc - add at the end the line below:
  - export LD_LIBRARY_PATH=/opt/oracle/instantclient_19_8
- source ~/.bashrc
- printenv = verify if LD_LIBRARY_PATH is show
- yarn start:dev

- helper => https://stackoverflow.com/questions/55823744/how-to-fix-cx-oracle-databaseerror-dpi-1047-cannot-locate-a-64-bit-oracle-cli
