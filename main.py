from app.rag import ask


def main():
    answer = ask("Нужена ссылка на коммерческое?")
    print(answer)


if __name__ == "__main__":

    main()
