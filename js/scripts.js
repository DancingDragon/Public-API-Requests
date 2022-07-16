let people;
getRandomPeople(createGallery);

//Add searchbar
document.querySelector(".search-container").insertAdjacentHTML('beforeend',
	`<form action="#" method="get">
		<input type="search" id="search-input" class="search-input" placeholder="Search...">
		<input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
	</form>`);
document.addEventListener('submit', (e) => {
	searchVal = document.getElementById("search-input").value;
	//update gallery with the filtered people
	document.getElementById("gallery").innerHTML = "";
	let filteredPeople = people.filter(p => (p.name.first.toLowerCase() + " " + p.name.last.toLowerCase()).includes(searchVal.toLowerCase()));
	createGallery(filteredPeople);
});

function getRandomPeople(callback) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = () => {
		if (xhr.readyState === 4) {
			people = JSON.parse(xhr.responseText).results;
			callback(people);
		}
	}
	xhr.open('GET', 'https://randomuser.me/api/?results=12&nat=gb')
	xhr.send();
}

function createGallery(people) {
	console.log(people[0]);
	//loop over all the people
	people.forEach((person, idx) => {
		//create the HTML for the personal gallery card
		let cardHTML = `<div class="card">
			<div class="card-img-container">
				<img class="card-img" src="${person.picture.thumbnail}" alt="profile picture">
			</div>
			<div class="card-info-container">
				<h3 id="name" class="card-name cap">${person.name.first} ${person.name.last}</h3>
				<p class="card-text">${person.email}</p>
				<p class="card-text cap">${person.location.city}, ${person.location.state}</p>
			</div>
		</div>`;
		
		//Add the card to the gallery
		let gallery = document.getElementById("gallery");
		gallery.insertAdjacentHTML("beforeend", cardHTML);
		
		//Compute the next and previous person
		if (idx === 0) {
			person.personPrev = people[people.length-1];
		} else {
			person.personPrev = people[idx-1];
		}
		person.personPrev.personNext = person;
		
		//Add clickevent for opening modal
		gallery.lastChild.addEventListener("click", () => addModal(person));
	});
}

function getPersonInfoHTML(person) {
	//Check and format the phone number	
	let phone = person.phone.replace(/\D/g, "").match(/(\d{3})(\d{3})(\d+)/);
	//Had one phonenumber with letters and stuff?! Could change how i format the phone number
	// but felt like this is good enough.
	phone = phone ? `(${phone[1]}) ${phone[2]}-${phone[3]}` : "Unknown phone number";
	
	//check and format the persons date.
	let birthday = new Date(person.dob.date);
	birthday = `${birthday.getMonth()}/${birthday.getDay()}/${birthday.getFullYear()}`;
				
	//Build and returnt the personinfo as HTML
	return  `<img class="modal-img" src="${person.picture.medium}" alt="profile picture">
				<h3 id="name" class="modal-name cap">${person.name.first} ${person.name.last}</h3>
				<p class="modal-text">${person.email}</p>
				<p class="modal-text cap">${person.location.city}</p>
				<hr>
				<p class="modal-text">${phone}</p>
				<p class="modal-text">${person.location.street.number} ${person.location.street.name}, ${person.location.state} ${person.location.postcode}</p>
				<p class="modal-text">Birthday: ${birthday}</p>`
}
//ADD modal
function addModal(person) {
	let personInfo = getPersonInfoHTML(person);
	
	//create the HTML for the modal
	let modalHTML = `<div class="modal-container">
		<div class="modal">
			<button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
			<div class="modal-info-container">
				${personInfo}
			</div>
		</div>
		<!-- IMPORTANT: Below is only for exceeds tasks -->
		<div class="modal-btn-container">
			<button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
			<button type="button" id="modal-next" class="modal-next btn">Next</button>
		</div>
	</div>`
	
	//Insert the modal to the document body and add functionality for the close button
	document.body.insertAdjacentHTML("beforeend", modalHTML);
	let modal = document.body.lastChild;
	document.getElementById("modal-close-btn").addEventListener('click', (e) => {
		document.body.removeChild(modal);
	});
	
	//Add click event to 'nextperson' and 'prevperson' buttons
	document.getElementById("modal-prev").addEventListener('click', (e) => {
		person = person.personPrev;
		document.querySelector(".modal-info-container").innerHTML = getPersonInfoHTML(person);
	});
	document.getElementById("modal-next").addEventListener('click', (e) => {
		person = person.personNext;
		document.querySelector(".modal-info-container").innerHTML = getPersonInfoHTML(person);
	});
}
