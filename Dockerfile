FROM oven/bun

WORKDIR /usr/app

COPY package.json ./
COPY bun.lockb ./

RUN bun install --production

COPY ./prisma/schema.prisma ./prisma/schema.prisma

RUN bunx prisma generate

COPY . .

ENV SIMPLE_POD_CONFIG_DIR $HOME/.config/simple-pod-sync
ENV SIMPLE_POD_DATA_DIR $HOME/local/share/simple-pod-sync

RUN mkdir -p $SIMPLE_POD_DATA_DIR $SIMPLE_POD_CONFIG_DIR

EXPOSE 3000

CMD ["bun", "run", "start"]

