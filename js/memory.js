var numclick=0;
		var first,second;
		var match=0;
		var cards=[];
		cards[0]="images/11 (1).jpg";
		cards[1]="images/11 (2).jpg";
		cards[2]="images/11 (3).jpg";
		cards[3]="images/11 (4).jpg";
		cards[4]="images/5.jpg";
		cards[5]="images/6.jpg";
		cards[6]="images/11 (1).jpg";
		cards[7]="images/11 (2).jpg";
		cards[8]="images/11 (3).jpg";
		cards[9]="images/11 (4).jpg";
		cards[10]="images/5.jpg";
		cards[11]="images/6.jpg";
		

		function shuffle(array)
		{
           var currentIndex=array.length,
           temValue,
		   randamIndex;
		   while(0 !== currentIndex)
		   {
			   randamIndex=Math.floor(Math.random()*currentIndex)
				currentIndex -=1;
				temValue=array[currentIndex]
				array[currentIndex]=array[randamIndex]
				array[randamIndex]=temValue
			}
		   return array;
		}
		var s;
		s=shuffle(cards)


		function choose(card)
		{if(numclick==0)
		  {

			  first = card;
			  document.images[card].src = cards[card];
			  numclick=1;
		  }
		else if(numclick==1)
		{
			numclick = 2;
			second = card;
			document.images[card].src=cards[card];
			timer=setInterval(control,500);
			
		}
		else
		{
			alert("you can click on image once");
		
		}
		}
		
		function control()
		{
			clearInterval(timer);
			numclick=0;
			if(cards[second] == cards[first])
			{
				match++;
				if(match==6)
				{ 
				alert("well done");
				location.reload();
				}
			}
			else
			{
				document.images[first].src="images/download1.jpg";
				document.images[second].src="images/download1.jpg";
				return;

			}
		}

