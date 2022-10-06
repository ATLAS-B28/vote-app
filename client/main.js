//we will go for class based apporach
class Poll{
    constructor(root,title){
        this.root=root,
        this.selected = sessionStorage.getItem('poll-selected')//selected can be javascript or other things choosen by the user
        //prevents the users to choose another after they select the things
        this.endpoint = 'http://localhost:3000/poll'
        this.root.insertAdjacentHTML('afterbegin',`
        <div class="poll__title">${title}</div>`)
        this._refresh()
    }
    async _refresh()
    {
         const response = await fetch(this.endpoint)
         const data = await response.json()//get the data
         this.root.querySelectorAll('.poll__option').forEach(option => {
            option.remove()//if we refresh the data we remove all the options optoions
         });
         for(const option of data){//option are the content of the array 'data'
            const template = document.createElement('template')
            const fragment = template.content
            template.innerHTML=`
            <div class="poll__option ${ this.selected == option.label ? "poll__option--selected": "" }">
            <div class="poll__option-fill"></div>
            <div class="poll__option-info">
                <span class="poll__label">${ option.label }</span>
                <span class="poll__percentage">${ option.percentage }%</span>
            </div>
        </div>

            `//this.selected has value of poll-selected which is equal to label add the class of option--selected
//after this we let the user a request and do something about it after selecting the options
            if (!this.selected) {//if no existing option is selected then we add a event listener
                fragment.querySelector('.poll__option')
                .addEventListener("click",()=>{
                    //after choosing an option we can add the count to that option
                    fetch(this.endpoint,{//options for fetch
                        method:'post',
                        body:`add=${option.label}`,//this body is thew urlencoded data
                        //whatever option is choosen
                        headers:{
                            "Content-Type":"application/x-www-form-urlencoded"
                        }
                    }).then(()=>{
                        this.selected = option.label//upadting the select value to the choosen one
                        sessionStorage.setItem('poll-selected',option.label)//this is a key to which we set the choosen option to
                       this._refresh()
                    })
                })
            }
            fragment.querySelector(".poll__option-fill").style.width = `${ option.percentage }%`;
            this.root.appendChild(fragment)
         }
    }
}
//create instance
const p = new Poll(
    document.querySelector('.poll')
    ,"Which do you prefer?"
)