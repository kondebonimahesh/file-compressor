#include <iostream>
#include <fstream>
#include <vector>
#include <zlib.h>

using namespace std;

vector<unsigned char> readFile(const string &filePath) {
    ifstream file(filePath, ios::binary);
    if (!file) {
        cerr << "Error opening file: " << filePath << endl;
        exit(1);
    }
    return vector<unsigned char>((istreambuf_iterator<char>(file)), istreambuf_iterator<char>());
}

void writeFile(const string &filePath, const vector<unsigned char> &data) {
    ofstream file(filePath, ios::binary);
    if (!file) {
        cerr << "Error writing to file: " << filePath << endl;
        exit(1);
    }
    file.write(reinterpret_cast<const char*>(data.data()), data.size());
}

vector<unsigned char> compressData(const vector<unsigned char> &data) {
    uLong sourceLen = data.size();
    uLong destLen = compressBound(sourceLen);
    vector<unsigned char> compressedData(destLen);

    int result = compress(compressedData.data(), &destLen, data.data(), sourceLen);
    if (result != Z_OK) {
        cerr << "Error during compression!" << endl;
        exit(1);
    }
    compressedData.resize(destLen); 
    return compressedData;
}

int main(int argc, char* argv[]) {
    if (argc != 3) {
        cerr << "Usage: compressor <input_file> <output_file>" << endl;
        return 1;
    }

    string inputFile = argv[1];
    string outputFile = argv[2];

    vector<unsigned char> fileData = readFile(inputFile);

    vector<unsigned char> compressedData = compressData(fileData);

    writeFile(outputFile, compressedData);

    cout << "File compressed successfully!" << endl;
    return 0;
}
