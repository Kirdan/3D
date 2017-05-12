#General
This document the solution for the challenged outlined here: https://s3.amazonaws.com/compiq-engineering/README.md

#Usage
 1. unzip the compiq.zip into any *inx environment, including Mac
 2. What's in box:
├── compiq.py
├── input.json
├── firms.csv
├── user-compensation-records.csv

 3. The input is provided in the input.json file, in a form of a dictionary
 4. From the command line run python compiq.py
 6. After the runtime 2 files will be added to the directory:
	 - extended.csv - new dataset, a union of firms.csv and user-compensation-records.csv
	 - output.json - the results

#Approach

Since the data format is CSV we don't have the luxury of SQL and thus no easy way to join the 2 tables. Luckily Python has a powerful CSV library. By leveraging the csv reader it's easy enough to emulate an SQl join or view by following these steps:

-  creating 2 dictionary objects representing for the 2 csv files
- iterating over the compensation dictionary and adding the compis column
- saving the new dictionary into a clean extended csv file

with new unioned csv it's easy enough to iterate over the similar companies. Scipy makes it very easy to calculate the percentile.

#Results

for this input:
```
{"user_id": 889, "firm_id": 2, "title": "Analyst"}
```
The result is:
```
{
	"user_id": 889, 
	"user_base": 114028.0, 
	"user_bonus": 180944.0, 
	"percentile_base": 20.0, 
	"percentile_bonus": 53.333333333333336
}
```
