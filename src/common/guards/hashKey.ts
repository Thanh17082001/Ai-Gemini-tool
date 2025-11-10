import * as bcrypt from 'bcrypt';

export async function hashKey(key: string) {
    const saltRounds = 10;
    const hash = await bcrypt.hash(key, saltRounds);
    console.log(hash.toString());
}

