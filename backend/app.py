from flask import Flask, jsonify, request
from pymongo import MongoClient
from bson.objectid import ObjectId
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Habilita o CORS para permitir requisições do frontend

client = MongoClient('mongodb://mongo:27017/')
db = client.clinica_popular  # Conecta ao banco de dados chamado "clinica_popular"

# Rota para listar todos os pacientes
@app.route('/pacientes', methods=['GET', 'POST'])
def gerenciar_pacientes():
    if request.method == 'GET':
        pacientes = list(db.pacientes.find({}))
        for paciente in pacientes:
            paciente['_id'] = str(paciente['_id'])  # Converte ObjectId para string
        return jsonify(pacientes), 200

    if request.method == 'POST':
        novo_paciente = request.get_json()
        result = db.pacientes.insert_one(novo_paciente)  # Insere o novo paciente no MongoDB
        return jsonify(str(result.inserted_id)), 201

# Rota para manipular pacientes por ID
@app.route('/pacientes/<paciente_id>', methods=['PUT', 'DELETE'])
def paciente_por_id(paciente_id):
    if request.method == 'PUT':
        updated_data = request.get_json()
        result = db.pacientes.update_one({"_id": ObjectId(paciente_id)}, {"$set": updated_data})
        if result.modified_count > 0:
            return jsonify({"message": "Paciente atualizado com sucesso"}), 200
        return jsonify({"error": "Paciente não encontrado"}), 404

    if request.method == 'DELETE':
        result = db.pacientes.delete_one({"_id": ObjectId(paciente_id)})
        if result.deleted_count > 0:
            return jsonify({"message": "Paciente deletado com sucesso"}), 200
        return jsonify({"error": "Paciente não encontrado"}), 404

# Rota para buscar paciente pelo CPF
@app.route('/pacientes/cpf/<cpf>', methods=['GET'])
def buscar_paciente_por_cpf(cpf):
    paciente = db.pacientes.find_one({"cpf": cpf})
    if paciente:
        paciente['_id'] = str(paciente['_id'])  # Converte ObjectId para string
        return jsonify(paciente), 200
    return jsonify({"error": "Paciente não encontrado"}), 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)