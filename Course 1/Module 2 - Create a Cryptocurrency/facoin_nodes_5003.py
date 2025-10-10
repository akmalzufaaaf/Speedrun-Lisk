# -*- coding: utf-8 -*-
"""
Created on Wed Feb 26 19:11:32 2025

@author: akmal
"""

# Terdapat beberapa library tambahan yang akan kita gunakan pada proses ini seperti,
# requests, urllib.parse, uuid

# import libraries
import datetime
import hashlib
import json
from flask import Flask, jsonify, request
import requests
from uuid import uuid4
from urllib.parse import urlparse

# Part 1 - Building a Blockchain

# make class
class Blockchain:
    
    # initiallize var or function
    def __init__(self):
        self.chain = []
        self.transaction = []
        self.create_block(proof = 1, previous_hash="0")
        self.nodes = set()
        
    # function to create new block
    def create_block(self, proof, previous_hash):
        block = {'index' : len(self.chain) + 1,
                 'timestamp' : str(datetime.datetime.now()),
                 'proof' : proof,
                 'previous_hash' : previous_hash,
                 'transaction' : self.transaction}
        self.transaction = []
        self.chain.append(block)
        return block
    
    # function to get previous hash
    def get_previous_block(self):
        return self.chain[-1]
    
    # proof of work function
    def proof_of_work(self, previous_proof):
        new_proof = 1
        check_proof = False
        while check_proof is False:
            hash_operation = hashlib.sha256(str(new_proof**2 - previous_proof**2).encode()).hexdigest()
            if hash_operation[:4] == '0000':
                check_proof = True
            else:
                new_proof += 1
        return new_proof
    
    # function to encode each block
    def hash(self, block):
        encoded_block = json.dumps(block, sort_keys=True).encode()
        return hashlib.sha256(encoded_block).hexdigest()
    
    # function to check chain validity
    def is_chain_valid(self, chain):
        previous_block = chain[0]
        block_index = 1
        while block_index < len(chain):
            block = chain[block_index]
            if block["previous_hash"] != self.hash(previous_block):
                return False
            previous_proof = previous_block["proof"]
            proof = block["proof"]
            hash_operation = hashlib.sha256(str(proof**2 - previous_proof**2).encode()).hexdigest()
            if hash_operation[:4] != "0000":
                return False
            previous_block = block
            block_index += 1
        return True
    
    # method to add transaction
    def add_transaction(self, sender, receiver, amount):
        self.transaction.append({'sender' : sender,
                                 'receiver' : receiver,
                                 'amount' : amount})
        previous_block = self.get_previous_block()
        return previous_block['index'] + 1
    
    # add_node
    def add_node(self, address):
        parsed_url = urlparse(address)
        self.nodes.add(parsed_url.netloc)
    
    # replace_chain
    def replace_chain(self):
        network = self.nodes
        longest_chain = None
        max_length = len(self.chain)
        for node in network:
            response = requests.get(f'http://{node}/get_chain')
            if response.status_code == 200:
                length = response.json()['length']
                chain = response.json()['chain']
                if length > max_length and self.is_chain_valid(chain):
                    max_length = length
                    longest_chain = chain
        if longest_chain:
            self.chain = longest_chain
            return True
        return False
                
    
# Part 2 - Mining our Blockchain

# Creating a Web App
app = Flask(__name__)
app.config['JSONIFY_PRETTYPRINT_REGULAR'] = False

# Create an address for the node on Port 5000
node_address = str(uuid4()).replace('-', '')

# Creating a Blockchain
blockchain = Blockchain()

# Mining a new block
@app.route("/mine_block", methods = ['GET'])
def mine_block():
    previous_block = blockchain.get_previous_block()
    previous_proof = previous_block["proof"]
    proof = blockchain.proof_of_work(previous_proof)
    previous_hash = blockchain.hash(previous_block)
    blockchain.add_transaction(sender = node_address, receiver = 'Superman', amount = 1)
    block = blockchain.create_block(proof, previous_hash)
    response = {"message" : "Congratulations, you mined a block!",
                "index" : block["index"],
                "timestamp" : block["timestamp"],
                "proof" : block["proof"],
                "previous_hash" : block["previous_hash"],
                "transaction" : block["transaction"]} 
    return jsonify(response), 200

# Getting the full Blockchain
@app.route("/get_chain", methods = ["GET"])
def get_chain():
    response = {"chain" : blockchain.chain,
                "length" : len(blockchain.chain)}
    return jsonify(response), 200

# Check if the Blockchain valid
@app.route("/is_valid", methods = ["GET"])
def is_valid():
    is_valid = blockchain.is_chain_valid(blockchain.chain)
    if is_valid:
        response = {"message" : "All good, The Blockchain is valid"}
    else:
        response = {"message" : "Something wrong, The Blockchain is not valid"}
    return jsonify(response), 200

# add_transaction
@app.route("/add_transaction", methods = ['POST'])
def add_transaction():
    json = request.get_json() # apa yang direturn request.get_json()? aku pikir perlu dikasih argumen untuk specify the target for the request
                              # jawaban: pada body request sudah ada data json, jadi fungsi ini hanya digunakan untuk mendapatkan json yang ada pada body request tersebut
    transaction_keys = ['sender', 'receiver', 'amount']
    if not all (key in json for key in transaction_keys): # karena yang dilakukan 
        return "Some element of the transaction is missing", 400
    if any(key not in transaction_keys for key in json):
        return "Some element of the transaction is not legal", 400
    index = blockchain.add_transaction(json['sender'], json['receiver'], json['amount'])
    response = {'message' : f"This transaction will be added to Block {index}"}
    return jsonify(response), 201

# Part 3 - Decentralizing our Blockchain

# Connecting node
@app.route("/connect_node", methods = ['POST'])
def connect_node():
    json = request.get_json()
    nodes = json.get('nodes')
    if nodes is None:
        return "No node", 400
    for node in nodes:
        blockchain.add_node(node)
    response = {
        "message" : "All the nodes are now connected. The Facoin Blockchain now contain the following node: ",
        "total_nodes" : list(blockchain.nodes)}
    return jsonify(response), 201

# replace chain
@app.route("/replace_chain", methods = ["GET"])
def replace_chain():
    is_chain_replaced = blockchain.replace_chain()
    if is_chain_replaced:
        response = {"message" : "The nodes have different chains so the chain was replaced with the longest chain",
                    "new_chain" : blockchain.chain}
    else:
        response = {"message" : "All good. The chain is the largest one.",
                    "actual_chain" : blockchain.chain}
    return jsonify(response), 200

# Running the app
app.run(host = "0.0.0.0", port = 5003)
    

    
        