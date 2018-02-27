import ExpansionRule from './ExpansionRule';
import CharNode from './CharNode'


class LSystem {
    grammar : Map<string, ExpansionRule>;
    seed: string;
    iterations: number;

    constructor(seed: string, iter: number) {
        this.seed = seed;
        this.iterations = iter;
        this.grammar = new Map<string, ExpansionRule>();
        this.createGrammar();
    }


    createGrammar() {
        this.grammar.set('F', new ExpansionRule(1.0, 'BX'));
        this.grammar.set('X', new ExpansionRule(1.0, 'F'));
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

            //if there is an expanded string for thie character in the grammar
            if(expand != null) {
                var expandedHead = CharNode.stringToLinkedList(expand.expanded);
                //link old prev to head of expanded string
                CharNode.linkNodes(oldPrev, expandedHead);

                var expandedLast = expandedHead;

                while(expandedLast.next != null) {
                    expandedLast = expandedLast.next;
                }
                //link last of expanded string to old next
                CharNode.linkNodes(expandedLast, oldNext);
            
            
            }
            
            
            //if you've reached the end of the input string, loop back to the head and return the head
            if(curr.next == null) {
                while(curr.prev != null) {
                    curr = curr.prev;
                }
                break;
            }
           
        }
       
        this.seed = CharNode.linkedListToString(curr);
        
    }

    doIterations() {
        console.log(this.seed);
        for(var i = 0; i < this.iterations; i++) {
            this.expandSeed();
            console.log(this.seed);
        }
    }
   
};
 export default LSystem;
