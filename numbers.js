/*
                      *NOTES*
When creating the decimal part of a "number" zeros must be
placed after single or double digit numbers to keep value.
Ex. [5] will be equal to .005 ; [500] will be equal to .5 ;

When creating a "number", fill in all parameters (charge,
value, and decimal) even if they are equal to zero to avoid
any uneccessary errors. Ex. The "correct" function checks
decimal spot [0] when called on a number. If decimal was
left blank in creation, an undefined error will occur.

*/

//to self:
    //make sure all functions use correct

    var suffixes = ['','K','M','B','T','AA','AB','AC','AD','AE',
    'AF','AG','AH','AI','AJ','AK','AL','AM','AN','AO','AP','AQ',
    'AR','AS','AT','AU','AV','AW','AX','AY','AZ','BA','BB','BC'];
    class engiene{
      constructor(){
        //returns rounded whole number version *needs reworking
        this.roundTo = function(num,place){
          var spot = [];
          if(place < num.decimal.length*3){
            //rounds specific place and sets that to spot[0]
            spot[0] = new digit(Math.round(num.decimal[ceil(place/3)-1].value*(Math.pow(10,place-3*ceil(place/3)))),num.decimal[ceil(place/3)-1].power);
            //makes sure spot[0] has the right amount of place holder 0's
            if(spot[0].value < 10){
              spot[0].value *= 100;
            }else if(spot[0].value < 100){
              spot[0].value *= 10;
            }
            //adds all unrounded decimal places before the selected "place"
            for(var i = place;i > 3;i-=3){
              spot.unshift(num.decimal[ceil(i/3)-2]);
            }

            //set nums decimal value to the newly rounded spot value
            num.decimal = spot;
            return num;
          }else{
            return num;
          }
        }
        //makes sure number is in correct syntax
        this.correct = function(num){
          //fixing decimal
          for( var i = num.decimal.length-1;i >0;i--){
            if(num.decimal[i].value > 999){
              num.decimal[i].value-=1000;
              num.decimal[i-1].value+=1;
            }
          }
          if(num.decimal[0].value > 999){
            num.decimal[0].value-=1000;
            num.value[num.value.length-1].value+=1;
          }
          //fixing value
          for( var i = num.value.length-1;i >0;i--){
            if(num.value[i].value > 999){
              num.value[i].value-=1000;
              num.value[i-1].value+=1;
            }
          }
          if(num.value[0].value > 999){
            num.value[0].value-=1000;
            num.value.unshift(new digit(1,num.value[0].power+3));
          }
          return num;
        }
        //returns value of num1 + num2 *needs update for charge
        this.combine = function(num1,num2){
          var answer = new number("+",[0],[0]);
          //checking for dif in charge
          if(num1.charge == num2.charge){
            //combining + and + or - and - numbers
            if(num1.isBiggerThan(num2)){
              answer.charge = num1.charge;
              //set answer's value as num1's value
              for(var i = num1.value.length-1;i >= 0;i--)
              answer.value[i] = new digit(num1.value[i].value,num1.value[i].power);

              //set answer's decimal as num1's decimal
              for(var i = num1.decimal.length-1;i >= 0;i--)
              answer.decimal[i] = new digit(num1.decimal[i].value,num1.decimal[i].power);

              //adding num2 value to answer
              for(var i = 0;i < num2.value.length;i++)
              answer.value[answer.value.length - (i+1)].value += num2.value[num2.value.length - (i+1)].value;

              //adding num2 decimal to answer
              for(var i = num2.decimal.length-1;i >= 0;i--){
                if(answer.decimal.length > i)
                answer.decimal[i].value += num2.decimal[i].value;
                else
                answer.decimal[i] = new digit(num2.decimal[i].value,num2.decimal[i].power);
              }

            }else{
              answer.charge = num2.charge;
              //set answer's value as num2's value
              for(var i = num2.value.length-1;i >= 0;i--){
                answer.value[i] = new digit(num2.value[i].value,num2.value[i].power);
              }
              //set answer's decimal as num2's decimal
              for(var i = num2.decimal.length-1;i >= 0;i--){
                answer.decimal[i] = new digit(num2.decimal[i].value,num2.decimal[i].power);
              }
              //adding num1 to answer
              for(var i = 0;i < num1.value.length;i++){
                answer.value[answer.value.length - (i+1)].value += num1.value[num1.value.length - (i+1)].value;
              }
              //adding num1 decimal to answer
              for(var i = num1.decimal.length-1;i >= 0;i--){
                if(answer.decimal.length > i){
                  answer.decimal[i].value += num1.decimal[i].value;
                }else{
                  answer.decimal[i] = new digit(num1.decimal[i].value,num1.decimal[i].power);
                }
              }
            }
          }else{
            //combining + and - numbers
            if(num1.absolute().isBiggerThan(num2.absolute())){
              answer.charge = num1.charge;
              //set answer's value as num1's value
              for(var i = num1.value.length-1;i >= 0;i--){
                answer.value[i] = new digit(num1.value[i].value,num1.value[i].power);
              }
              //subtracting num2 from answer
              for(var i = 0;i < num2.value.length;i++){
                //checks if current digit of answer is bigger than current digit in num2
                if(answer.value[answer.value.length - (i+1)].value >= num2.value[num2.value.length - (i+1)].value){
                  //subtracts num2 current digit from answer current digit
                  answer.value[answer.value.length - (i+1)].value -= num2.value[num2.value.length - (i+1)].value;
                }else {
                  var stop = false;
                  //finds a number left of current digit that is bigger than 1
                  for(var j = 0;stop == false;j++){
                    if(answer.value[answer.value.length - (j+i+2)].value >= 1){
                      for(var k = 0;k <= j;k++){
                        //subtracts 1 from digit (j-k) amount left of current digit
                        answer.value[answer.value.length - ((j+i+2)-k)].value -= 1;
                        //adds 1000 to digit (j-k) amount away from current digit
                        answer.value[answer.value.length - ((j+i+1)-k)].value += 1000;
                      }
                      //subtracts num2 current digit from answer current digit
                      answer.value[answer.value.length - (i+1)].value -= num2.value[num2.value.length - (i+1)].value;
                      stop = true;
                    }
                  }
                }
              }
              //sets hold to string version of answers' charge
              var hold;
              if(answer.charge > 0){
                hold = "+";
              }else{
                hold = "-";
              }
              //combines answer with one and sets that value equal to answer
              //answer = this.combine(answer,new number(hold,[1],[0]));
              //setting answer's decimal to num1's decimal
              for(var i = num1.decimal.length-1;i >= 0;i--){
                answer.decimal[i] = new digit(num1.decimal[i].value,num1.decimal[i].power);
              }
              //subtracting num2's decimal from answer
              for(var i = 0;i < num2.decimal.length;i++){


              }
            }else{

            }
          }
          return this.correct(answer);
        }
        //combines all numbers in an array and returns their total value
        this.add = function(array){
          var list = array;
        }
      }
    }
    class digit{
      constructor(value,power){
        this.value = value;
        this.power = power;
        if(this.value > 0)
        this.fill = Math.floor(Math.log10(this.value))+1;
        else
        this.fill = 3;
      }
    }
    class number{
      constructor(charge,input,input2){
        this.value = [];
        this.decimal = [];
        this.charge = +1;
        //sets charge
        if(charge == "-") this.charge = -1;
        //creates value
        this.input = input;
        this.startLength = this.input.length;

        for(var i = this.input.length -1;i >= 0;i--){
          this.value[i] = new digit(this.input[i],((this.startLength - this.input.length)*3));
          this.input.splice(i,1);
        }
        //creates decimal
        if(input2 != undefined){
          this.input2 = input2;
          this.startLength2 = this.input2.length;

          for(var j = this.input2.length -1;j >= 0;j--){
            this.decimal[j] = new digit(this.input2[j],((this.input2.length)*3));
            this.input2.splice(j,1);
          }
        }
        //determines whether caller is bigger than called and returns true or false
        this.isBiggerThan = function(num){
          var info;
          if(this.charge > num.charge){
            info = true;
          }else if(this.charge < num.charge){
            info = false;
          }else{
            if(this.value[0].power > num.value[0].power){
              info = true;
            }else if(this.value[0].power == num.value[0].power){
              if((this.value[0].value - num.value[0].value) > 0){
                info = true;
              }else{
                info = false;
              }
            }else{
              info = false;
            }
          }

          if(this.charge == -1 && num.charge == -1){
            if(info == true){
              info = false;
            }else{
              info = true;
            }
          }
          return info;
        }
        //returns entire number in string format NOTE: For display purposes
        this.show = function(){
          var list = [];
          var list2 = "";
          var name;
          //caculates show for value
          for(var i = 0;i < this.value.length;i++){
            if(i == 0){
              list[i] = this.value[i].value;
            }else if(this.value[i].value >= 100){
              list[i] = this.value[i].value;
            }else if(this.value[i].value >= 10){
              list[i] = "0" + this.value[i].value;
            }else if(this.value[i].value >= 1){
              list[i] = "00" + this.value[i].value;
            }else if(this.value[i].value == 0){
              list[i] = "000";
            }
          }
          //calculates show for decimal
          for(var j = 0;j < this.decimal.length;j++){
            if(j == this.decimal.length){
              list2 += this.decimal[j].value;
            }else if(this.decimal[j].value >= 100){
              list2 += this.decimal[j].value;
            }else if(this.decimal[j].value >= 10){
              list2 += "0" + this.decimal[j].value;
            }else if(this.decimal[j].value >= 1){
              list2 += "00" + this.decimal[j].value;
            }else if(this.decimal[j].value == 0){
              list2 += "000";
            }
          }
          //calculates show for charge
          if(this.charge != -1){
            name = "+ " + list.toString() + "." + list2.toString();
          }else{name = "- " + list.toString() + "." + list2.toString();}
          return name;
        }
        //returns absolute value
        this.absolute = function(){
          var answer = new number("",[],[]);
          //set answer's value as num1's value
          for(var i = this.value.length-1;i >= 0;i--){
            answer.value[i] = new digit(this.value[i].value,this.value[i].power);
          }
          //set answer's decimal as num1's decimal
          for(var i = this.decimal.length-1;i >= 0;i--){
            answer.decimal[i] = new digit(this.decimal[i].value,this.decimal[i].power);
            //changes anwers charge
            answer.charge = 1;

            return answer;
          }
        }
      }
    }
