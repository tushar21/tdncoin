import {SHA256} from 'crypto-js'

class Block {
    previousHash: string;
    index:number;
    data:string;
    hash: string;
    timestamp: number;
    nonce: number;
    constructor(index, timestamp, previousHash, data){
        this.index = index;
        this.previousHash = previousHash;
        this.data = JSON.stringify(data);
        this.timestamp = timestamp;
        this.nonce = 0;
        this.hash = this.generateHash();
    }

    generateHash(){
        const stringToHash= `${this.index}${this.timestamp}${this.previousHash}${this.nonce}${JSON.stringify(this.data)}`;
        this.hash = SHA256(stringToHash).toString();
        return this.hash;
    }

    mineBlock(difficulty:number){
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')){
            this.nonce++;
            this.hash = this.generateHash();
        }
        console.log(`Block mined with hash: ${this.hash}`)
    }
}

class Blockchain {
    chain: any[];
    difficulty: number;

    constructor(){
        this.difficulty = 2;
        this.chain = [this.createGenesisBlock()];        
    }

    private createGenesisBlock(){
        const genesisBlock = new Block(0,new Date().getTime(),"0", "This is genesis block data")
        genesisBlock.mineBlock(this.difficulty);
        return genesisBlock;
    }

    getLatestBlock(){
        return this.chain[this.chain.length -1];
    } 
    
    addBlock(data){
        const previousBlock = this.getLatestBlock();
        const previousHash = previousBlock.hash;
        const blockIndex = previousBlock.index+1;
        const newBlock = new Block(blockIndex, new Date().getTime(), previousHash, data);
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
        console.log(this.chain, 'this.chain after adding new block')
    }

    isChainValid(){
        for(let i= 1; i< this.chain.length; i++){
            let currentBlock = this.chain[i];            
            if(currentBlock.hash !== currentBlock.generateHash()){
                return false;
            }
            let prevBlock = this.chain[i-1];
            if(prevBlock.hash !== currentBlock.previousHash){
                return false;
            }            
        }
        return true
    }



}

const tdncoin = new Blockchain();
tdncoin.addBlock("First block after genesis block");
console.log(tdncoin.isChainValid());