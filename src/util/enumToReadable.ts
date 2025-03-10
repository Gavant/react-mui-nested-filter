export default function enumToReadable(text: string, toSentenceCase = false) {
    if (!text) {
        console.error('Text passed as undefined');
    }
    // Replace underscores with spaces, convert to lowercase, and split into words
    const words = text.toLowerCase().split('_');

    // Capitalize each word for Title Case, or only capitalize the first word for Sentence Case
    const formattedWords = words.map((word, index) => {
        if (!toSentenceCase || index === 0) {
            return word.charAt(0).toUpperCase() + word.slice(1);
        }
        return word;
    });

    // Join the words with a space
    return formattedWords.join(' ');
}
