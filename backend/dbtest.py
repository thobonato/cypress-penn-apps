from pymongo import MongoClient
print("Hello, MongoDB!")

# Connect to MongoDB
# client = MongoClient('mongodb://atlas-sql-66ef3e5fed6e0809b6d476ac-oghgb.a.query.mongodb.net/user_profiles?ssl=true&authSource=admin',
#                      username='akhilmetukuru2016',
#                      password='test1234',
#                      authSource='admin',
#                      authMechanism='SCRAM-SHA-256')

# Construct the MongoDB connection string
username = 'akhilmetukuru2016'
password = 'test1234'
cluster = 'atlas-sql-66ef3e5fed6e0809b6d476ac-oghgb'
dbname = 'user_profiles'

# Create the connection string
connection_string = f"mongodb+srv://akhilmetukuru2016:test1234@cypress.oghgb.mongodb.net/"

# Connect to MongoDB
client = MongoClient(connection_string)

# Test the connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

# Now you can use the client to interact with your database
db = client['Cypress']
col = db['user_profiles']

# Try to find a document
res = col.find_one()
print("Find result:", res)

# Try to insert a document
mydict = { "name": "John", "address": "Highway 37" }
x = col.insert_one(mydict)
print("Insert result:", x.inserted_id)

)

# # Equivalent of SELECT * FROM table
# all_documents = collection.find()

# # Print all documents
# for document in all_documents:
#     print(document)

# # Insert new documents
# names_to_insert = [
#     {"name": "Alice"},
#     {"name": "Bob"},
#     {"name": "Charlie"}
# ]

# insert_result = collection.insert_many(names_to_insert)
# print(f"Inserted {len(insert_result.inserted_ids)} documents")

# # Create a dummy numpy array representing an image
# dummy_image = np.random.rand(100, 100, 3)  # 100x100 RGB image
# print("Dummy image shape:", dummy_image.shape)

# # Convert numpy array to binary for MongoDB storage
# image_binary = bson.Binary(dummy_image.tobytes())

# # Insert the image into MongoDB
# image_document = {
#     "image_name": "dummy_image",
#     "image_data": image_binary,
#     "shape": dummy_image.shape,
#     "dtype": str(dummy_image.dtype)
# }

# image_insert_result = collection.insert_one(image_document)
# print(f"Inserted image document with ID: {image_insert_result.inserted_id}")

# # Retrieve the image from MongoDB
# retrieved_image_doc = collection.find_one({"image_name": "dummy_image"})

# if retrieved_image_doc:
#     # Convert binary data back to numpy array
#     retrieved_image = np.frombuffer(retrieved_image_doc['image_data'], 
#                                 dtype=np.float64).reshape(retrieved_image_doc['shape'])
#     print("Retrieved image shape:", retrieved_image.shape)
#     print("Retrieved image matches original:", np.array_equal(dummy_image, retrieved_image))

# # Verify insertion by querying again
# all_documents = collection.find()
# print("\nAfter insertion:")
# for document in all_documents:
#     if 'image_data' in document:
#         print(f"Document with image: {document['image_name']}")
#     else:
#         print(document)

# # Close the connection
# client.close()