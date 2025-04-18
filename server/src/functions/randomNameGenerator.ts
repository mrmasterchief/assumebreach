const adjectiveList = [
    "Adventurous", "Brave", "Clever", "Daring", "Eager", "Fearless", "Generous", "Honest", "Intelligent", "Joyful",
    "Kind", "Loyal", "Mighty", "Noble", "Optimistic", "Proud", "Quick", "Resilient", "Strong", "Tenacious","Unique", 
    "Valiant", "Wise", "Zealous", "Witty", "Zany", "Brilliant", "Charming", "Daring", "Energetic", "Fierce", "Gentle", 
    "Humble", "Inspiring", "Jovial", "Keen", "Lively", "Magical", "Nurturing", "Outstanding", "Playful", "Radiant", 
    "Sincere", "Thoughtful", "Uplifted", "Vibrant", "Wondrous", "Youthful", "Zesty", "Adorable", "Bubbly", "Caring", 
    "Dazzling", "Elegant", "Fabulous", "Gleeful", "Heartwarming", "Impressive", "Joyous", "Kooky", "Lovely", "Mesmerizing",
    "Nifty", "Outstanding", "Pleasant", "Quaint", "Remarkable", "Sassy", "Terrific", "Unforgettable", "Vivacious", 
    "Whimsical", "Xenial", "Yummy", "Zany", "Adventurous", "Brave", "Clever", "Daring", "Eager", "Fearless", "Generous", 
    "Honest", "Intelligent", "Joyful", "Kind", "Loyal", "Mighty", "Noble", "Optimistic", "Proud", "Quick", "Resilient", 
    "Strong", "Tenacious",
];

const nounList = [
    "Lion", "Tiger", "Eagle", "Shark", "Wolf", "Dragon", "Phoenix", "Bear", "Falcon", "Hawk",
    "Cheetah", "Leopard", "Jaguar", "Rhino", "Elephant", "Giraffe", "Zebra", "Panda", "Koala", "Kangaroo",
    "Dolphin", "Whale", "Octopus", "Turtle", "Crab", "Starfish", "Seahorse", "Penguin", "Otter", "Seal",
    "Parrot", "Flamingo", "Peacock", "Owl", "Hedgehog", "Squirrel", "Rabbit", "Frog", "Toad", "Lizard",
    "Chameleon", "Iguana", "Gecko", "Snake", "Tortoise", "Crocodile", "Alligator", "Hippo", "Gorilla", "Chimpanzee",
    "Orangutan", "Baboon", "Macaw", "Toucan", "Cockatoo", "Parakeet", "Canary", "Finch", "Sparrow", "Robin",
    "Bluejay", "Cardinal", "Woodpecker", "Hummingbird", "Swallow", "Warbler", "Wren", "Nightingale", "Lark", "Dove",
    "Pigeon", "Quail", "Turkey", "Peafowl", "Emu", "Ostrich", "Cassowary", "Kiwi", "Kea", "Takahe",
    "Kakapo", "Takahe", "Weka", "Rhea", "Flamingo", "Pelican", "Stork", "Heron", "Ibis"
];

export const randomNameGenerator = () => {
    const randomAdjective = adjectiveList[Math.floor(Math.random() * adjectiveList.length)];
    const randomNoun = nounList[Math.floor(Math.random() * nounList.length)];
    return `${randomAdjective} ${randomNoun}`;
}