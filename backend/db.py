from pymongo.mongo_client import MongoClient

class MongoConn:
    def __init__(self, uri, db_name="cypress", coll_name="users") -> None:
        self.uri = uri
        self.client = MongoClient(self.uri)
        self.db_name = db_name
        self.coll_name = coll_name
        self.db = self.client[self.db_name]
        self.coll = self.db[self.coll_name]

    def insert_data(self, chrome_id, pic_encoding):
        
        data = {
            'chrome_id' : chrome_id,
            'pic_encoding' : pic_encoding
        }
        res = self.coll.insert_one(data)
        return res.inserted_id


    def get_pic_encoding(self, chrome_id):
        res = self.coll.find_one({"chrome_id": chrome_id})
        return res["pic_encoding"]
