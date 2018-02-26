import Rule from './Rule';
import CharNode from './CharNode'


class LSystem {
    grammar : Map<string, Rule>;
    seed: string;
    iterations: number;

    constructor(seed: string, iter: number) {
        this.seed = seed;
        this.iterations = iter;
        this.grammar = new Map<string, Rule>();
        this.createGrammar();
    }


    createGrammar() {
        this.grammar.set('H', new Rule(1.0, 'X'));
        this.grammar.set('X', new Rule(1.0, 'HH'));
        //FINISH SETTING UP GRAMMAR HERE
    }

    expandSeed() {
        var axiom = CharNode.stringToLinkedList(this.seed);
        var curr = axiom;
        //iterate through seed and for each char, look it up in the rulebook and replace the char with that entry
        for(curr; curr != null; curr = curr.next) {
            var oldNext = curr.next;
            var oldPrev = curr.prev;
            var currChar = curr.char;
            var expand = this.grammar.get(currChar);
            //loop through expanded and create a new node for each one
            //set next of last one to the old next and set prev of first one to old prev
            var expandedHead = CharNode.stringToLinkedList(expand.expanded);
            //link old prev to head of expanded string
            CharNode.linkNodes(oldPrev, expandedHead);

            var expandedLast = expandedHead;
            while(expandedLast.next != null) {
                expandedLast = expandedLast.next;
            }
            //link last of expanded string to old next
            CharNode.linkNodes(expandedLast, oldNext);
            
            
            //if you've reached the end of the input string, loop back to the head and return the head
            if(curr.next == null) {
                while(curr.prev != null) {
                    curr = curr.prev;
                }
                break;
            }
           
        }
       
        this.seed = CharNode.linkedListToString(curr);
        console.log(this.seed);
    }

    doIterations() {
        for(var i = 0; i < this.iterations; i++) {
            this.expandSeed();
        }
    }
   
};
 export default LSystem;
